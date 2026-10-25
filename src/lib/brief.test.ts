import { describe, it, expect } from "vitest";
import { buildBrief, buildAiPrompt } from "./brief";
import type { ClientInfo, ProjectConfig } from "./validation/project";

describe("buildBrief and buildAiPrompt", () => {
  const dummyClient: ClientInfo = {
    fullName: "Ahmed Mansour",
    email: "ahmed@example.com",
    country: "Saudi Arabia",
    preferredContact: "email",
  };

  const dummyConfig: ProjectConfig = {
    business: {
      category: "Real Estate Portal",
      description: "A luxury property showcase with virtual tours and agent appointment scheduling.",
      audience: "High-net-worth investors",
      market: "Riyadh & Dubai",
      goals: ["Attract international buyers", "Automate property tour bookings"],
    },
    projectType: "web_app",
    pages: ["Home", "Listings", "Property View", "Book Tour"],
    design: {
      style: "premium_luxury",
      colors: ["#111827", "#D97706"],
      referenceUrls: ["https://luxury-properties.example.com"],
    },
    features: ["Map Integration", "Virtual Tour Viewer", "Lead CRM"],
    backend: ["Supabase Database", "Edge Functions"],
    budget: "5000_plus",
    timeline: "2 months",
    description: "High-end real estate web platform with cinematic imagery and instant WhatsApp agent inquiry.",
  };

  it("builds a brief identifying when required elements are missing", () => {
    const incompleteClient: ClientInfo = {
      fullName: "Ali",
      email: "ali@example.com",
      country: "UAE",
      preferredContact: "email",
    };
    const incompleteConfig: ProjectConfig = {
      ...dummyConfig,
      timeline: undefined,
      pages: [],
      features: [],
      design: {
        style: "modern_minimal",
        colors: [],
        referenceUrls: [],
      },
      budget: "not_sure",
    };

    const brief = buildBrief("MMK-20261024-TEST99", incompleteClient, incompleteConfig);
    expect(brief.missing).toContain("Client phone number");
    expect(brief.missing).toContain("Preferred delivery timeframe");
    expect(brief.missing).toContain("Required pages");
    expect(brief.missing).toContain("Functional requirements");
    expect(brief.missing).toContain("Color palette");
    expect(brief.missing).toContain("Reference websites");
    expect(brief.missing).toContain("Confirmed budget");
  });

  it("generates Claude AI prompt with repository instructions", () => {
    const brief = buildBrief("MMK-20261024-CLAUDE", dummyClient, dummyConfig);
    const prompt = buildAiPrompt(brief, "claude");

    expect(prompt).toContain("Development specification: MMK-20261024-CLAUDE");
    expect(prompt).toContain("Work directly in the repository");
    expect(prompt).toContain("Real Estate Portal");
    expect(prompt).toContain("High-net-worth investors");
    expect(prompt).toContain("premium_luxury");
  });

  it("generates ChatGPT AI prompt with file-by-file instructions", () => {
    const brief = buildBrief("MMK-20261024-CHATGPT", dummyClient, dummyConfig);
    const prompt = buildAiPrompt(brief, "chatgpt");

    expect(prompt).toContain("Development specification: MMK-20261024-CHATGPT");
    expect(prompt).toContain("Produce the complete implementation file by file");
  });
});
