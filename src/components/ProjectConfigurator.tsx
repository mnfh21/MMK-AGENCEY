"use client";

import React, { useState, useId } from "react";
import { PROJECT_TYPES, DESIGN_STYLES, BUDGETS } from "@/lib/validation/project";
import { buildBrief, buildAiPrompt } from "@/lib/brief";

const PROJECT_TYPE_LABELS: Record<string, { label: string; desc: string; icon: string }> = {
  business_website: { label: "Business Website", desc: "Corporate brand presence & lead generation", icon: "🏢" },
  ecommerce: { label: "E-Commerce", desc: "Online store, payment processing & catalog", icon: "🛍️" },
  landing_page: { label: "Landing Page", desc: "High-conversion product or campaign launch", icon: "🚀" },
  portfolio: { label: "Portfolio / Agency", desc: "Creative showcase, case studies & bio", icon: "🎨" },
  saas: { label: "SaaS Platform", desc: "Subscription software with auth & billing", icon: "⚡" },
  web_app: { label: "Custom Web App", desc: "Interactive portal or complex workflow tool", icon: "💻" },
  dashboard: { label: "Dashboard / Admin", desc: "Analytics, metrics, charts & data management", icon: "📊" },
  redesign: { label: "Platform Redesign", desc: "Modern overhaul of existing application", icon: "🔄" },
  custom: { label: "Bespoke System", desc: "Tailored architecture for specialized needs", icon: "✨" },
};

const DESIGN_STYLE_LABELS: Record<string, { label: string; desc: string; palette: string[] }> = {
  modern_minimal: { label: "Modern Minimal", desc: "Spacious, crisp typography, clean whitespace", palette: ["#ffffff", "#0f172a", "#94a3b8"] },
  premium_luxury: { label: "Premium Luxury", desc: "Deep dark tones, warm gold accents, refined elegance", palette: ["#07090e", "#d97706", "#fef3c7"] },
  corporate: { label: "Corporate Tech", desc: "Trustworthy blues, structured layouts, professional feel", palette: ["#0f172a", "#2563eb", "#e2e8f0"] },
  creative: { label: "Creative & Bold", desc: "Vibrant gradients, expressive shapes, lively vibe", palette: ["#8b5cf6", "#ec4899", "#06b6d4"] },
  editorial: { label: "Editorial & Magazine", desc: "Rich serif typography, artful grid arrangements", palette: ["#18181b", "#fafafa", "#a1a1aa"] },
  futuristic: { label: "Futuristic Cyber", desc: "Neon glows, glassmorphism, dark holographic feel", palette: ["#090d16", "#06b6d4", "#6366f1"] },
  bold_experimental: { label: "Bold Experimental", desc: "Unconventional typography, high-contrast layouts", palette: ["#000000", "#f43f5e", "#fbbf24"] },
  custom: { label: "Custom Brand Identity", desc: "Built strictly around your corporate brand book", palette: ["#3b82f6", "#10b981", "#64748b"] },
};

const BUDGET_LABELS: Record<string, string> = {
  under_500: "< $500 (Basic Prototype)",
  "500_1500": "$500 - $1,500 (Standard)",
  "1500_3000": "$1,500 - $3,000 (Professional)",
  "3000_5000": "$3,000 - $5,000 (Scale & Enterprise)",
  "5000_plus": "$5,000+ (Comprehensive Bespoke Solution)",
  not_sure: "Need guidance / Discussion during review",
};

const PRESET_PAGES = ["Home", "About Us", "Services", "Pricing", "Case Studies", "Blog", "Contact", "Client Portal", "Dashboard", "Checkout"];
const PRESET_FEATURES = [
  "Supabase Auth & Roles",
  "Stripe / Payment Gateway",
  "Realtime Notifications",
  "Arabic & English (RTL/LTR)",
  "AI Copilot / Assistant",
  "Admin Analytics Dashboard",
  "SEO & Metadata Engine",
  "File Upload & Cloud Storage",
  "Automated Email Alerts",
  "REST / GraphQL API"
];

export function ProjectConfigurator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [projectType, setProjectType] = useState<typeof PROJECT_TYPES[number]>("business_website");
  const [budget, setBudget] = useState<typeof BUDGETS[number]>("1500_3000");
  const [timeline, setTimeline] = useState("4 to 6 weeks");

  const [designStyle, setDesignStyle] = useState<typeof DESIGN_STYLES[number]>("premium_luxury");
  const [colors, setColors] = useState<string[]>(["#07090e", "#6366f1", "#06b6d4"]);
  const [newColorHex, setNewColorHex] = useState("#f59e0b");
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState("");

  const [pages, setPages] = useState<string[]>(["Home", "Services", "Contact"]);
  const [newPageInput, setNewPageInput] = useState("");
  const [features, setFeatures] = useState<string[]>(["Supabase Auth & Roles", "SEO & Metadata Engine", "Automated Email Alerts"]);
  const [newFeatureInput, setNewFeatureInput] = useState("");

  const [businessCategory, setBusinessCategory] = useState("");
  const [businessAudience, setBusinessAudience] = useState("");
  const [businessMarket, setBusinessMarket] = useState("Global & Regional");
  const [businessGoals, setBusinessGoals] = useState("Launch modern web presence and double client inbound inquiries");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  // Client Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone" | "whatsapp">("whatsapp");
  const [consent, setConsent] = useState(true);

  // AI Spec Preview Tab
  const [aiPromptTarget, setAiPromptTarget] = useState<"claude" | "chatgpt">("claude");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Quick Handlers
  const togglePage = (p: string) => {
    setPages((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const addCustomPage = () => {
    const trimmed = newPageInput.trim();
    if (trimmed && !pages.includes(trimmed)) {
      setPages((prev) => [...prev, trimmed]);
      setNewPageInput("");
    }
  };

  const toggleFeature = (f: string) => {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const addCustomFeature = () => {
    const trimmed = newFeatureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setNewFeatureInput("");
    }
  };

  const addColor = () => {
    if (/^#[0-9a-fA-F]{6}$/.test(newColorHex) && !colors.includes(newColorHex) && colors.length < 8) {
      setColors((prev) => [...prev, newColorHex]);
    }
  };

  const removeColor = (c: string) => {
    setColors((prev) => prev.filter((x) => x !== c));
  };

  const addReferenceUrl = () => {
    const trimmed = newUrlInput.trim();
    if (trimmed && /^https?:\/\//i.test(trimmed) && !referenceUrls.includes(trimmed) && referenceUrls.length < 10) {
      setReferenceUrls((prev) => [...prev, trimmed]);
      setNewUrlInput("");
    }
  };

  // Build temporary brief for live AI prompt preview
  const currentBrief = buildBrief("MMK-DRAFT-SPEC", {
    fullName: fullName || "Valued Client",
    email: email || "client@example.com",
    phone: phone || undefined,
    company: company || undefined,
    country: country || "Global",
    preferredContact,
  }, {
    business: {
      category: businessCategory || "Digital Platform",
      description: projectDesc || "Custom web application engineered for optimal conversion and user engagement.",
      audience: businessAudience || "Target clientele and business partners",
      market: businessMarket || "MENA & International",
      goals: businessGoals ? [businessGoals] : ["Deliver exceptional digital experience"],
    },
    projectType,
    pages,
    design: {
      style: designStyle,
      colors,
      referenceUrls,
    },
    features,
    backend: ["Supabase PostgreSQL", "Serverless API Routes", "Resend Automated Mailer"],
    budget,
    timeline: timeline || undefined,
    description: projectDesc || "High performance digital platform with modern architecture.",
    notes: projectNotes || undefined,
  });

  const liveAiPrompt = buildAiPrompt(currentBrief, aiPromptTarget);

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(liveAiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const copyRefToClipboard = () => {
    if (successReference) {
      navigator.clipboard.writeText(successReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Client-side quick checks
    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError("Please provide your full name (at least 2 characters).");
      setStep(4);
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please provide a valid contact email.");
      setStep(4);
      return;
    }
    if (!projectDesc.trim() || projectDesc.trim().length < 20) {
      setFormError("Please describe your project in at least 20 characters in Step 3.");
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    // Generate fresh idempotency key
    const idempotencyKey =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
            (c ^ ((crypto.getRandomValues(new Uint8Array(1))[0] ?? 0) & (15 >> (c / 4)))).toString(16)
          );

    const payload = {
      idempotencyKey,
      consent: true,
      client: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        country: country.trim() || "Egypt",
        preferredContact,
      },
      config: {
        business: {
          category: businessCategory.trim() || "Digital Platform",
          description: projectDesc.trim(),
          audience: businessAudience.trim() || "General Audience",
          market: businessMarket.trim() || "International",
          goals: businessGoals.trim() ? [businessGoals.trim()] : ["Establish high-performance digital presence"],
        },
        projectType,
        pages: pages.length > 0 ? pages : ["Home"],
        design: {
          style: designStyle,
          colors,
          referenceUrls,
        },
        features: features.length > 0 ? features : ["Responsive Layout"],
        backend: ["Supabase PostgreSQL", "Serverless API Routes"],
        budget,
        timeline: timeline.trim() || undefined,
        description: projectDesc.trim(),
        notes: projectNotes.trim() || undefined,
      },
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.error?.fields) {
          setFieldErrors(data.error.fields);
        }
        throw new Error(data.error?.message || "Failed to submit project request.");
      }

      setSuccessReference(data.data.reference);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setFormError(err.message || "An error occurred while transmitting your project details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="configurator" style={{ padding: "6rem 0", position: "relative" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 3rem" }}>
          <div className="badge" style={{ marginBottom: "1rem" }}>
            <span>Interactive Project Architect</span>
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)", fontWeight: 800, marginBottom: "1rem" }}>
            Configure Your Vision & Get an Instant AI Specification
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Answer a few tailored questions. Our system drafts your technical project scope, prepares AI prompt blueprints, and reserves your project reference.
          </p>
        </div>

        {/* Success Modal / Result View */}
        {successReference ? (
          <div className="glass-card" style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              color: "var(--accent-emerald)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)"
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              Project Request Transmitted!
            </h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
              Your requirements have been securely registered in the MMK Digital Agency pipeline.
            </p>

            <div style={{
              background: "rgba(10, 14, 22, 0.9)",
              border: "1px dashed var(--accent-primary)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Official Project Reference Number
              </span>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "0.05em", color: "#a5b4fc" }}>
                {successReference}
              </div>
              <button
                onClick={copyRefToClipboard}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}
              >
                {copiedRef ? "✓ Copied to Clipboard!" : "Copy Reference Number"}
              </button>
            </div>

            <div style={{ textAlign: "left", background: "rgba(255, 255, 255, 0.03)", padding: "1.5rem", borderRadius: "var(--radius-md)", marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.8rem", color: "var(--accent-secondary)" }}>
                What Happens Next?
              </h4>
              <ul style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, paddingLeft: "1.2rem" }}>
                <li>Our lead architect reviews your stack and design guidelines within 24 hours.</li>
                <li>You will receive direct contact via your chosen channel ({preferredContact}).</li>
                <li>Use your Reference Number above anytime in the <b>Track Request</b> section below.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSuccessReference(null);
                setStep(1);
              }}
              className="btn btn-primary"
            >
              Start Another Project Specification
            </button>
          </div>
        ) : (
          /* Main Configurator Form */
          <div className="glass-card" style={{ maxWidth: "980px", margin: "0 auto", padding: "2.5rem 2rem" }}>
            {/* Step Stepper Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2.5rem",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              {[
                { s: 1, label: "1. Project Scope" },
                { s: 2, label: "2. Aesthetics" },
                { s: 3, label: "3. Features & Pages" },
                { s: 4, label: "4. Client & AI Spec" },
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => setStep(item.s as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: step === item.s ? "var(--text-main)" : "var(--text-dim)",
                    borderBottom: step === item.s ? "2px solid var(--accent-primary)" : "none",
                    paddingBottom: "0.5rem"
                  }}
                >
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: step === item.s ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700
                  }}>
                    {item.s}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {formError && (
              <div style={{
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.4)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                color: "#fecdd3",
                marginBottom: "2rem",
                fontSize: "0.9rem"
              }}>
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Project Scope */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Select Project Archetype
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Choose the primary structure of your digital application.
                  </p>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2.5rem"
                  }}>
                    {PROJECT_TYPES.map((t) => {
                      const meta = PROJECT_TYPE_LABELS[t] || { label: t, desc: "", icon: "💻" };
                      const isSelected = projectType === t;
                      return (
                        <div
                          key={t}
                          onClick={() => setProjectType(t)}
                          className={`glass-card glass-card-interactive ${isSelected ? "glass-card-selected" : ""}`}
                          style={{ padding: "1.25rem", borderRadius: "var(--radius-md)" }}
                        >
                          <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>{meta.icon}</div>
                          <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>{meta.label}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{meta.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    <div className="form-group">
                      <label className="form-label">Estimated Investment / Budget</label>
                      <select
                        className="form-control"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value as any)}
                        style={{ cursor: "pointer" }}
                      >
                        {BUDGETS.map((b) => (
                          <option key={b} value={b} style={{ background: "#0d111a" }}>
                            {BUDGET_LABELS[b]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Desired Timeframe</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 4 to 6 weeks, or ASAP"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-primary" id="step1-next-btn">
                      <span>Next: Design & Aesthetics</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Aesthetics */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Design Direction & Aesthetics
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Select the design visual character that reflects your brand prestige.
                  </p>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2.5rem"
                  }}>
                    {DESIGN_STYLES.map((s) => {
                      const meta = DESIGN_STYLE_LABELS[s] || { label: s, desc: "", palette: [] };
                      const isSelected = designStyle === s;
                      return (
                        <div
                          key={s}
                          onClick={() => setDesignStyle(s)}
                          className={`glass-card glass-card-interactive ${isSelected ? "glass-card-selected" : ""}`}
                          style={{ padding: "1.2rem", borderRadius: "var(--radius-md)" }}
                        >
                          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}>
                            {meta.palette.map((c, i) => (
                              <div key={i} style={{ width: "16px", height: "16px", borderRadius: "50%", background: c, border: "1px solid rgba(255, 255, 255, 0.2)" }} />
                            ))}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>{meta.label}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{meta.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Color Palette Manager */}
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <label className="form-label">
                      <span>Brand Color Palette (Max 8)</span>
                      <span className="form-hint">{colors.length} selected</span>
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                      {colors.map((c) => (
                        <div
                          key={c}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.35rem 0.65rem",
                            borderRadius: "var(--radius-full)",
                            background: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "0.85rem"
                          }}
                        >
                          <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: c, border: "1px solid #fff" }} />
                          <span>{c}</span>
                          <button type="button" onClick={() => removeColor(c)} style={{ color: "var(--text-dim)", marginLeft: "4px" }}>×</button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        style={{ width: "42px", height: "42px", borderRadius: "8px", border: "none", cursor: "pointer", background: "none" }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: "140px" }}
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        placeholder="#6366f1"
                      />
                      <button type="button" onClick={addColor} className="btn btn-secondary" style={{ padding: "0.7rem 1rem", fontSize: "0.85rem" }}>
                        + Add Swatch
                      </button>
                    </div>
                  </div>

                  {/* Reference URLs */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Inspirational Reference Websites (Optional)</span>
                      <span className="form-hint">Links to sites whose aesthetics or flows you admire</span>
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.8rem" }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com"
                        value={newUrlInput}
                        onChange={(e) => setNewUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addReferenceUrl(); } }}
                      />
                      <button type="button" onClick={addReferenceUrl} className="btn btn-secondary">
                        + Add URL
                      </button>
                    </div>

                    {referenceUrls.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {referenceUrls.map((url, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.04)", padding: "0.5rem 0.85rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                            <span style={{ color: "var(--accent-secondary)" }}>{url}</span>
                            <button type="button" onClick={() => setReferenceUrls(referenceUrls.filter((_, idx) => idx !== i))} style={{ color: "var(--text-dim)" }}>Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                    <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn btn-primary" id="step2-next-btn">
                      <span>Next: Features & Pages</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Features & Pages */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Scope, Pages & Functional Requirements
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Specify key pages and technical capabilities required for your launch.
                  </p>

                  {/* Pages Manager */}
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <label className="form-label">
                      <span>Planned Application Pages</span>
                      <span className="form-hint">Click to toggle or add custom pages</span>
                    </label>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
                      {PRESET_PAGES.map((p) => {
                        const active = pages.includes(p);
                        return (
                          <button
                            type="button"
                            key={p}
                            onClick={() => togglePage(p)}
                            style={{
                              padding: "0.45rem 0.85rem",
                              borderRadius: "var(--radius-full)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              background: active ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.05)",
                              color: active ? "#fff" : "var(--text-muted)",
                              border: active ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)"
                            }}
                          >
                            {active ? `✓ ${p}` : `+ ${p}`}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add bespoke page name..."
                        value={newPageInput}
                        onChange={(e) => setNewPageInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomPage(); } }}
                      />
                      <button type="button" onClick={addCustomPage} className="btn btn-secondary">
                        Add Page
                      </button>
                    </div>
                  </div>

                  {/* Features Manager */}
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <label className="form-label">
                      <span>Functional Capabilities & Integrations</span>
                      <span className="form-hint">Toggle required infrastructure</span>
                    </label>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
                      {PRESET_FEATURES.map((f) => {
                        const active = features.includes(f);
                        return (
                          <button
                            type="button"
                            key={f}
                            onClick={() => toggleFeature(f)}
                            style={{
                              padding: "0.45rem 0.85rem",
                              borderRadius: "var(--radius-full)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              background: active ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.05)",
                              color: active ? "#38bdf8" : "var(--text-muted)",
                              border: active ? "1px solid #06b6d4" : "1px solid var(--border-subtle)"
                            }}
                          >
                            {active ? `✓ ${f}` : `+ ${f}`}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add custom integration..."
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomFeature(); } }}
                      />
                      <button type="button" onClick={addCustomFeature} className="btn btn-secondary">
                        Add Feature
                      </button>
                    </div>
                  </div>

                  {/* Business Overview Inputs */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", marginBottom: "1.5rem" }}>
                    <div className="form-group">
                      <label className="form-label">Business / Industry Category</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Luxury Real Estate, Fintech SaaS, Healthtech"
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Target Audience</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Enterprise CTOs, High-Net-Worth Individuals"
                        value={businessAudience}
                        onChange={(e) => setBusinessAudience(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                    <label className="form-label">
                      <span>Detailed Project Description & Scope</span>
                      <span className="form-hint">(Min 20 characters)</span>
                    </label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Describe what your application does, key workflows, and desired user journey..."
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(4)} className="btn btn-primary" id="step3-next-btn">
                      <span>Next: Client Details & AI Spec</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Client Details & Live AI Spec */}
              {step === 4 && (
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Client Verification & Live Technical Specification
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Provide contact details to receive your formal quote and explore the generated AI specification below.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem", marginBottom: "1.5rem" }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Mohamed Mostafa"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        id="client-fullname-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        id="client-email-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+20 100 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company / Brand (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MMK Holdings"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem", marginBottom: "2rem" }}>
                    <div className="form-group">
                      <label className="form-label">Country / Region</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Egypt, UAE, Saudi Arabia, USA"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Contact Channel</label>
                      <select
                        className="form-control"
                        value={preferredContact}
                        onChange={(e) => setPreferredContact(e.target.value as any)}
                      >
                        <option value="whatsapp" style={{ background: "#0d111a" }}>WhatsApp</option>
                        <option value="email" style={{ background: "#0d111a" }}>Email</option>
                        <option value="phone" style={{ background: "#0d111a" }}>Direct Phone Call</option>
                      </select>
                    </div>
                  </div>

                  {/* Live AI Prompt Specification Preview Box */}
                  <div style={{
                    background: "rgba(10, 14, 22, 0.95)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    marginBottom: "2rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>🤖</span>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Realtime AI Blueprint Specification</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => setAiPromptTarget("claude")}
                          style={{
                            padding: "0.3rem 0.65rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: aiPromptTarget === "claude" ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.05)",
                            color: "#fff"
                          }}
                        >
                          Claude Format
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiPromptTarget("chatgpt")}
                          style={{
                            padding: "0.3rem 0.65rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: aiPromptTarget === "chatgpt" ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.05)",
                            color: "#fff"
                          }}
                        >
                          ChatGPT Format
                        </button>
                        <button
                          type="button"
                          onClick={copyPromptToClipboard}
                          className="btn btn-secondary"
                          style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}
                        >
                          {copiedPrompt ? "✓ Copied!" : "Copy Spec"}
                        </button>
                      </div>
                    </div>

                    <pre style={{
                      maxHeight: "180px",
                      overflowY: "auto",
                      background: "rgba(0, 0, 0, 0.4)",
                      padding: "1rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      color: "#94a3b8",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace"
                    }}>
                      {liveAiPrompt}
                    </pre>
                  </div>

                  {/* Consent */}
                  <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      style={{ width: "16px", height: "16px", accentColor: "var(--accent-primary)" }}
                    />
                    <span>
                      I authorize MMK Digital Agency to review these requirements and prepare a formal project proposal and technical breakdown.
                    </span>
                  </label>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button type="button" onClick={() => setStep(3)} className="btn btn-secondary">
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ padding: "0.9rem 2.2rem" }}
                      id="submit-project-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                          <span>Transmitting Project...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Request</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
