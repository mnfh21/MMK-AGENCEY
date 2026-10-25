import "server-only";
import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  RESEND_API_KEY: z.string().min(1).default("re_dummy_local"),
  RESEND_FROM_EMAIL: z.string().min(3).default("MMK Agency <hello@example.com>"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  AGENCY_NOTIFY_EMAIL: z.string().email().default("mm0491762@gmail.com"),
  ADMIN_PASSWORD: z.string().min(6).default("mmk2026admin"),
});

let cached: z.infer<typeof schema> | undefined;

export function isEnvConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && url.startsWith("http") && key.length >= 20);
}

export function serverEnv() {
  return (cached ??= schema.parse(process.env));
}
