"use client";

import React from "react";

const SERVICES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    title: "Bespoke Web Applications",
    tag: "Next.js 15 & React 19",
    desc: "Custom web applications architected for mission-critical reliability, fluid animations, and supersonic load times.",
    highlights: ["Server Components & SSR", "Strict TypeScript Models", "Tailored Component Architecture"]
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
    title: "High-Conversion E-Commerce",
    tag: "Luxury & Retail",
    desc: "Cinematic, luxury online stores with seamless multi-currency checkout, instant search, and automated inventory sync.",
    highlights: ["Stripe & Regional Gateways", "Dynamic Localization & Arabic RTL", "Sub-1s Cart & Checkout Flow"]
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    title: "SaaS Platforms & Portals",
    tag: "Full-Stack Cloud",
    desc: "End-to-end cloud products with role-based access control (RBAC), multi-tenancy, telemetry, and live client dashboards.",
    highlights: ["Interactive Real-time Charts", "Granular Admin Permissions", "Webhook & Third-Party APIs"]
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    title: "Supabase & Database Architecture",
    tag: "Enterprise Postgres",
    desc: "Robust relational schemas, automated migration pipelines, row-level security policies, and zero data leakage.",
    highlights: ["Row-Level Security (RLS)", "Automated Status History", "Zero Public Secrets Policy"]
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
        <path d="M12 12L2.1 12.5"></path>
      </svg>
    ),
    title: "AI Integrations & Autonomous Agents",
    tag: "LLMs & Automation",
    desc: "Enrich your systems with Gemini, Claude, and OpenAI integrations, automated document analysis, and conversational copilots.",
    highlights: ["Structured Output & Function Calling", "Live Streaming Responses", "Prompt Engineering Pipelines"]
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    title: "Performance & Conversion Optimization",
    tag: "Audit & Scale",
    desc: "Transform sluggish, bloated websites into lightning-fast, high-converting platforms with perfect 95+ Lighthouse scores.",
    highlights: ["Core Web Vitals Optimization", "Edge Caching & CDN Routing", "SEO & Metadata Enhancement"]
  }
];

export function Services() {
  return (
    <section id="services" style={{ padding: "5rem 0", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3.5rem" }}>
          <div className="badge" style={{ marginBottom: "1rem" }}>
            <span>Core Capabilities</span>
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.8vw, 3rem)", fontWeight: 800, marginBottom: "1rem" }}>
            Precision Digital Solutions for Ambitious Brands
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Every project is engineered with dedicated craftsmanship. No cookie-cutter templates, no bloatware.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.75rem"
        }}>
          {SERVICES.map((s, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all var(--transition-normal)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.25)"
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-subtle)"
                }}>
                  {s.tag}
                </span>
              </div>

              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                {s.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem", flexGrow: 1 }}>
                {s.desc}
              </p>

              <div style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "1.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem"
              }}>
                {s.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-main)" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent-secondary)" }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
