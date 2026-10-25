import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

const COOKIE_NAME = "mmk_admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecret() {
  const env = serverEnv();
  return env.SUPABASE_SERVICE_ROLE_KEY || "mmk-default-secure-secret-salt-2026";
}

export function getAdminPassword(): string {
  const env = serverEnv();
  return env.ADMIN_PASSWORD || "mmk2026admin";
}

/** Generate a signed session token: timestamp.signature */
export function generateAdminSessionToken(): string {
  const secret = getSecret();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(`admin-session:${timestamp}`).digest("hex");
  return `${timestamp}.${signature}`;
}

/** Validate session token */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestampStr, signature] = parts;
  if (!timestampStr || !signature) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (7 days)
  if (Date.now() - timestamp > SESSION_DURATION_SECONDS * 1000) {
    return false;
  }

  const secret = getSecret();
  const expectedSignature = crypto.createHmac("sha256", secret).update(`admin-session:${timestampStr}`).digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
  } catch {
    return false;
  }
}

/** Verify if incoming Request is authenticated as Admin */
export function verifyAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  const rawToken = match?.[1];
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  return isValidSessionToken(token);
}

/** Verify cookie from next/headers */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export const ADMIN_COOKIE_CONFIG = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  },
};
