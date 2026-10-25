import { z } from "zod";

export const PROJECT_TYPES = ["business_website","ecommerce","landing_page","portfolio","saas","web_app","dashboard","redesign","custom"] as const;
export const DESIGN_STYLES = ["modern_minimal","premium_luxury","corporate","creative","editorial","futuristic","bold_experimental","custom"] as const;
export const BUDGETS = ["under_500","500_1500","1500_3000","3000_5000","5000_plus","not_sure"] as const;

// Only http(s): z.string().url() alone would accept javascript: URLs.
const httpUrl = z.string().trim().max(500).url().refine((u) => /^https?:\/\//i.test(u), "Must be an http(s) URL");
const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const tag = z.string().trim().min(1).max(60);

export const projectConfigSchema = z.object({
  business: z.object({
    category: text(2, 100),
    description: text(10, 2000),
    audience: text(2, 500),
    market: text(2, 200),
    goals: z.array(text(1, 200)).max(10),
  }).strict(),
  projectType: z.enum(PROJECT_TYPES),
  pages: z.array(tag).max(30),
  design: z.object({
    style: z.enum(DESIGN_STYLES),
    colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).max(8),
    referenceUrls: z.array(httpUrl).max(10),
  }).strict(),
  features: z.array(tag).max(30),
  backend: z.array(tag).max(10),
  budget: z.enum(BUDGETS),
  timeline: text(1, 80).optional(),
  description: text(20, 5000),
  existingSiteUrl: httpUrl.optional(),
  notes: z.string().trim().max(3000).optional(),
}).strict();

// .strict() everywhere rejects unknown keys (mass assignment): clients can never set status, price, or ids.
export const projectSubmissionSchema = z.object({
  idempotencyKey: z.string().uuid(),
  consent: z.literal(true),
  client: z.object({
    fullName: text(2, 120),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().max(32).optional(),
    company: z.string().trim().max(120).optional(),
    country: text(2, 80),
    preferredContact: z.enum(["email", "phone", "whatsapp"]),
  }).strict(),
  config: projectConfigSchema,
}).strict();

export type ProjectSubmission = z.infer<typeof projectSubmissionSchema>;
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type ClientInfo = ProjectSubmission["client"];
