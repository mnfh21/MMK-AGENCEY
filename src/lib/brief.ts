import type { ClientInfo, ProjectConfig } from "@/lib/validation/project";

export type PromptTarget = "claude" | "chatgpt";

export function buildBrief(reference: string, client: ClientInfo, c: ProjectConfig) {
  const missing: string[] = [];
  if (!client.phone) missing.push("Client phone number");
  if (!c.timeline) missing.push("Preferred delivery timeframe");
  if (c.pages.length === 0) missing.push("Required pages");
  if (c.features.length === 0) missing.push("Functional requirements");
  if (c.design.colors.length === 0) missing.push("Color palette");
  if (c.design.referenceUrls.length === 0) missing.push("Reference websites");
  if (c.budget === "not_sure") missing.push("Confirmed budget");
  return { reference, client, config: c, missing };
}
export type Brief = ReturnType<typeof buildBrief>;

const list = (xs: string[]) => (xs.length ? xs.map((x) => `- ${x}`).join("\n") : "- (not provided)");

/** Template-based prompt (no external AI call). Admin can edit the result before copying. */
export function buildAiPrompt(b: Brief, target: PromptTarget): string {
  const c = b.config;
  const intro = target === "claude"
    ? "Work directly in the repository: inspect the environment, implement the full project, run type checks, linting, tests and a production build, and report only what you actually ran."
    : "Produce the complete implementation file by file, with install and run steps, and state clearly which parts you could not verify.";
  return `# Development specification: ${b.reference}

${intro}
Use only the CONFIRMED requirements below. Do not invent requirements; ask about anything listed under MISSING INFORMATION.

## Project overview
- Type: ${c.projectType}
- Client: ${b.client.company || b.client.fullName} (${b.client.country})
- Business category: ${c.business.category}
- Description: ${c.description}
- Audience: ${c.business.audience}
- Market: ${c.business.market}

## CONFIRMED requirements
### Business goals
${list(c.business.goals)}
### Pages
${list(c.pages)}
### Design direction
- Style: ${c.design.style}
- Colors: ${c.design.colors.join(", ") || "(not provided)"}
- References:
${list(c.design.referenceUrls)}
### Functional requirements
${list(c.features)}
### Backend requirements
${list(c.backend)}
### Budget / timeline (subject to agency review)
- Budget: ${c.budget}
- Timeline: ${c.timeline ?? "(not provided)"}
### Additional notes
${c.notes ?? "(none)"}

## MISSING INFORMATION (not confirmed)
${list(b.missing)}

## Technical expectations
- Strict TypeScript, server-side validation of all input, authentication and authorization enforced on the server.
- Database with row-level security, least-privilege access, no secrets in client code.
- Tests for validation, authorization and core flows.

## Acceptance criteria and deliverables
- All confirmed pages and features work end to end; unauthorized access is rejected.
- Production build passes; README documents setup, environment variables and deployment.
`;
}
