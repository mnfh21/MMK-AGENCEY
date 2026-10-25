import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAdminPassword,
  generateAdminSessionToken,
  isAuthenticatedAdmin,
  ADMIN_COOKIE_CONFIG,
} from "@/lib/auth/admin";

export const runtime = "nodejs";

// Rate limiting in-memory for auth attempts
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  return NextResponse.json({ ok: true, authenticated: isAuth });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (record && record.lockedUntil > now) {
    const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
    return NextResponse.json(
      { ok: false, error: `Too many failed attempts. Try again in ${remainingSec} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { password } = body;

    const actualPassword = getAdminPassword();

    if (!password || typeof password !== "string" || password !== actualPassword) {
      const current = record ?? { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= 5) {
        current.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
      }
      failedAttempts.set(ip, current);

      return NextResponse.json(
        { ok: false, error: "Invalid admin passcode." },
        { status: 401 }
      );
    }

    // Success: reset attempts
    failedAttempts.delete(ip);

    const token = generateAdminSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

    return NextResponse.json({ ok: true, authenticated: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Authentication processing failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_CONFIG.name);
  return NextResponse.json({ ok: true, authenticated: false, message: "Logged out" });
}
