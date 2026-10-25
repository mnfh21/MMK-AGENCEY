"use client";

import React from "react";

const STACK_ITEMS = [
  { name: "Next.js 15", category: "Framework", desc: "Server Components & Turbopack rendering" },
  { name: "React 19", category: "UI Engine", desc: "Concurrent features & Optimistic UI" },
  { name: "TypeScript 5", category: "Type System", desc: "100% strict typing & zero untyped models" },
  { name: "Supabase & Postgres", category: "Database", desc: "Row-Level Security (RLS) & real-time sync" },
  { name: "Zod 3", category: "Validation", desc: "Runtime input validation & security guards" },
  { name: "Vitest 2", category: "Quality & Tests", desc: "Automated regression testing & test suite" },
];

export function TechStack() {
  return (
    <section id="capabilities" style={{ padding: "5rem 0", position: "relative" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem" }}>
          <div className="badge" style={{ marginBottom: "1rem" }}>
            <span>Uncompromising Architecture</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
            Engineered with Modern Industry Standards
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            We refuse to use legacy bloatware. Our core stack is chosen for maximum speed, bulletproof security, and effortless maintainability.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem"
        }}>
          {STACK_ITEMS.map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: "1.5rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-main)" }}>{item.name}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--accent-secondary)", background: "rgba(6, 182, 212, 0.12)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)" }}>
                  {item.category}
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
