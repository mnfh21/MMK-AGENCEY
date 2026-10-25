import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

/** Public project reference, e.g. MMK-20261024-K7QH2M. Uniqueness is enforced by the DB; callers retry on conflict. */
export function generateReference(now: Date = new Date()): string {
  const d = now.toISOString().slice(0, 10).replace(/-/g, "");
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `MMK-${d}-${s}`;
}
