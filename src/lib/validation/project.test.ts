import { describe, it, expect } from "vitest";
import { projectSubmissionSchema, projectConfigSchema } from "./project";

describe("projectConfigSchema", () => {
  const validConfig = {
    business: {
      category: "E-Commerce Luxury Apparel",
      description: "An exclusive boutique offering curated sustainable fabrics and tailored clothing.",
      audience: "Fashion-conscious professionals aged 25-45",
      market: "GCC & MENA Region",
      goals: ["Increase conversion by 40%", "Expand international shipping to Europe"],
    },
    projectType: "ecommerce" as const,
    pages: ["Home", "Shop Catalog", "Product Detail", "Checkout", "Our Atelier"],
    design: {
      style: "premium_luxury" as const,
      colors: ["#0A0F1D", "#E2C481", "#FFFFFF"],
      referenceUrls: ["https://example-luxury.com", "https://atelier-demo.com"],
    },
    features: ["Stripe Checkout", "Arabic & English Localization", "Dynamic Currency"],
    backend: ["Supabase Database", "Resend Email Notifications"],
    budget: "5000_plus" as const,
    timeline: "6 weeks",
    description: "Full end-to-end e-commerce store with custom luxury theme and high performance score.",
    existingSiteUrl: "https://old-boutique.com",
    notes: "Requires fast page load under 1.5s globally.",
  };

  it("validates a fully valid project configuration", () => {
    const res = projectConfigSchema.safeParse(validConfig);
    expect(res.success).toBe(true);
  });

  it("rejects unknown keys due to strict mode", () => {
    const invalid = { ...validConfig, unauthorizedField: "malicious" };
    const res = projectConfigSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects javascript: urls in referenceUrls", () => {
    const invalid = {
      ...validConfig,
      design: {
        ...validConfig.design,
        referenceUrls: ["javascript:alert(1)"],
      },
    };
    const res = projectConfigSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects invalid hex color format", () => {
    const invalid = {
      ...validConfig,
      design: {
        ...validConfig.design,
        colors: ["#FFF", "blue"], // needs 6 hex digits with #
      },
    };
    const res = projectConfigSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("projectSubmissionSchema", () => {
  const validSubmission = {
    idempotencyKey: "a1b2c3d4-e5f6-47a8-b9c0-123456789abc",
    consent: true,
    client: {
      fullName: "Mohamed Mostafa",
      email: "client@example.com",
      phone: "+201001234567",
      company: "MMK Enterprises",
      country: "Egypt",
      preferredContact: "whatsapp" as const,
    },
    config: {
      business: {
        category: "Fintech Platform",
        description: "Modern financial analytics dashboard for small and medium enterprises.",
        audience: "Business Owners and CFOs",
        market: "Middle East",
        goals: ["Streamline cash flow tracking"],
      },
      projectType: "saas" as const,
      pages: ["Dashboard", "Analytics", "Reports", "Billing"],
      design: {
        style: "futuristic" as const,
        colors: ["#0f172a", "#38bdf8"],
        referenceUrls: ["https://dashboard-inspiration.com"],
      },
      features: ["Realtime Charts", "Role-Based Access Control"],
      backend: ["PostgreSQL", "Next.js API"],
      budget: "3000_5000" as const,
      timeline: "4 weeks",
      description: "Cloud-native SaaS dashboard with dark mode and real-time metrics streaming.",
    },
  };

  it("validates a compliant project submission", () => {
    const res = projectSubmissionSchema.safeParse(validSubmission);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.client.email).toBe("client@example.com");
    }
  });

  it("normalizes email to lowercase", () => {
    const submission = {
      ...validSubmission,
      client: {
        ...validSubmission.client,
        email: "Mohamed.Kamel@EXAMPLE.COM",
      },
    };
    const res = projectSubmissionSchema.safeParse(submission);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.client.email).toBe("mohamed.kamel@example.com");
    }
  });

  it("requires consent to be true", () => {
    const submission = {
      ...validSubmission,
      consent: false,
    };
    const res = projectSubmissionSchema.safeParse(submission);
    expect(res.success).toBe(false);
  });
});
