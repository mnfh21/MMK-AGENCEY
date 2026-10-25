import { NextResponse } from "next/server";
import { projectSubmissionSchema } from "@/lib/validation/project";
import { generateReference } from "@/lib/reference";
import { buildBrief } from "@/lib/brief";
import { adminDb } from "@/lib/supabase/admin";
import { serverEnv, isEnvConfigured } from "@/lib/env";

export const runtime = "nodejs";

// In-memory limiter: per-instance only. Use a shared store (e.g. Upstash/Redis) for real production protection.
const hits = new Map<string, number[]>();
function limited(ip: string, max = 15, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

const fail = (status: number, code: string, message: string, fields?: unknown) =>
  NextResponse.json({ ok: false, error: { code, message, fields } }, { status });

async function sendNotification(brief: ReturnType<typeof buildBrief>, projectId: string) {
  try {
    const env = serverEnv();
    const { client: cl, config: c, reference } = brief;
    const row = (k: string, v: string) => `<tr><td style="padding:6px 12px;color:#667"><b>${esc(k)}</b></td><td style="padding:6px 12px">${esc(v)}</td></tr>`;
    const html = `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto"><h2>New project request ${esc(reference)}</h2><table>
      ${row("Client", cl.fullName)}${row("Email", cl.email)}${row("Business", c.business.category)}${row("Project type", c.projectType)}
      ${row("Pages", c.pages.join(", ") || "-")}${row("Features", c.features.join(", ") || "-")}${row("Design", c.design.style)}
      ${row("Budget", c.budget)}${row("Timeline", c.timeline ?? "-")}</table>
      <p><a href="${esc(env.NEXT_PUBLIC_SITE_URL)}/admin/projects/${esc(projectId)}">Open in admin dashboard</a></p></div>`;
    const db = adminDb();

    if (!env.RESEND_API_KEY || env.RESEND_API_KEY.startsWith("re_dummy")) {
      console.info("notification_skipped_dummy_key", { projectId, reference });
      return;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [env.AGENCY_NOTIFY_EMAIL], reply_to: cl.email, subject: `New project request ${reference}`, html }),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string };
    if (!res.ok || !body.id) throw new Error(`Resend HTTP ${res.status}`);
    await db.from("notifications").insert({ project_id: projectId, type: "new_project", recipient: env.AGENCY_NOTIFY_EMAIL, status: "sent", provider_message_id: body.id });
  } catch (err) {
    // Email failure must never lose the saved project: record a safe error and move on.
    console.error("notification_failed", { projectId });
    try {
      const db = adminDb();
      await db.from("notifications").insert({ project_id: projectId, type: "new_project", recipient: "admin", status: "failed", error: err instanceof Error ? err.message.slice(0, 200) : "unknown" });
    } catch {
      // ignore secondary db notification error
    }
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return fail(429, "RATE_LIMITED", "Too many requests. Please try again later.");

  const raw = await req.text();
  if (raw.length > 100_000) return fail(413, "TOO_LARGE", "Request body too large.");
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return fail(400, "BAD_JSON", "Invalid JSON."); }

  const parsed = projectSubmissionSchema.safeParse(json);
  if (!parsed.success) return fail(422, "VALIDATION", "Please check the highlighted fields.", parsed.error.flatten().fieldErrors);
  const { idempotencyKey, client, config } = parsed.data;

  // In-memory or simulated fallback if Supabase DB is not yet configured in local environment
  if (!isEnvConfigured()) {
    const reference = generateReference();
    console.info(`[Dev / Local Mode] Project submitted without remote DB. Generated Reference: ${reference}`);
    return NextResponse.json({
      ok: true,
      data: {
        reference,
        devSimulated: true,
        message: "Project received successfully (Simulated mode: configure Supabase in .env for persistent database storage).",
      },
    }, { status: 201 });
  }

  try {
    const db = adminDb();
    const existing = async () =>
      (await db.from("projects").select("reference").eq("idempotency_key", idempotencyKey).maybeSingle()).data?.reference;

    const dup = await existing(); // duplicate submission (double click / retry): return the original reference
    if (dup) return NextResponse.json({ ok: true, data: { reference: dup, duplicate: true } });

    const phoneValue = client.phone?.trim() ? client.phone.trim() : null;
    const companyValue = client.company?.trim() ? client.company.trim() : null;

    const { data: cl, error: clErr } = await db.from("clients")
      .upsert({ name: client.fullName, email: client.email, phone: phoneValue, country: client.country }, { onConflict: "email" })
      .select("id").single();
    if (clErr || !cl) throw clErr ?? new Error("client upsert failed");

    for (let attempt = 0; attempt < 3; attempt++) {
      const reference = generateReference();
      const { data: p, error } = await db.from("projects").insert({
        reference, idempotency_key: idempotencyKey, client_id: cl.id,
        project_type: config.projectType, budget: config.budget, timeline: config.timeline ?? null,
        config: { ...config, client: { company: companyValue, preferredContact: client.preferredContact } },
      }).select("id").single();
      if (!error && p) {
        await sendNotification(buildBrief(reference, client, config), p.id);
        return NextResponse.json({ ok: true, data: { reference } }, { status: 201 });
      }
      if (error?.code !== "23505") throw error;
      const raced = await existing();
      if (raced) return NextResponse.json({ ok: true, data: { reference: raced, duplicate: true } });
      // otherwise: reference collision, loop with a new reference
    }
    throw new Error("could not allocate reference");
  } catch (err) {
    console.error("project_submit_failed", err instanceof Error ? err.message : "unknown");
    return fail(500, "SERVER_ERROR", "We could not save your request. Please try again.");
  }
}
