import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin";
import { isEnvConfigured } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "Missing ID" }, { status: 400 });

  if (!isEnvConfigured()) {
    return NextResponse.json({
      ok: true,
      data: {
        id,
        reference: `MMK-20261025-${id.slice(0, 6).toUpperCase()}`,
        status: "under_review",
        project_type: "Full-Stack Web Application",
        budget: "$5,000 - $10,000",
        clients: { name: "Client Preview", email: "client@example.com", country: "United States" },
        config: { business: { name: "Sample Client Co" }, pages: ["Home", "App"], features: ["Auth", "Dashboard"] }
      }
    });
  }

  try {
    const db = adminDb();
    // Allow lookup by either UUID or reference
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const query = db
      .from("projects")
      .select("*, clients(*), project_notes(*), project_status_history(*)")
      .eq(isUuid ? "id" : "reference", id)
      .maybeSingle();

    const { data, error } = await query;
    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "Missing ID" }, { status: 400 });

  try {
    const body = await req.json();
    const { status, agreed_price, expected_delivery, note } = body;

    if (!isEnvConfigured()) {
      return NextResponse.json({
        ok: true,
        message: "Status updated (Simulated Mode).",
        data: { id, status, agreed_price, expected_delivery }
      });
    }

    const db = adminDb();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const updatePayload: Record<string, any> = {};
    if (status) updatePayload.status = status;
    if (agreed_price !== undefined) updatePayload.agreed_price = agreed_price;
    if (expected_delivery !== undefined) updatePayload.expected_delivery = expected_delivery;

    const { data: updated, error } = await db
      .from("projects")
      .update(updatePayload)
      .eq(isUuid ? "id" : "reference", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    // If an internal note was submitted
    if (note && typeof note === "string" && note.trim().length > 0) {
      try {
        const projectId = updated.id;
        await db.from("project_notes").insert({
          project_id: projectId,
          admin_id: "00000000-0000-0000-0000-000000000000",
          content: note.trim()
        });
      } catch {
        // ignore note insertion error
      }
    }

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
