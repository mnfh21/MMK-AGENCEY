"use client";

import React from "react";

export function Hero() {
  return (
    <section style={{
      position: "relative",
      padding: "6.5rem 0 4.5rem",
      overflow: "hidden"
    }}>
      {/* Ambient background glow circle */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "350px",
        background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Top Badge */}
        <div style={{ display: "inline-block", marginBottom: "1.5rem" }}>
          <div className="badge">
            <span className="badge-dot" />
            <span>Next-Gen Web Architecture & Digital Engineering</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
          fontWeight: 800,
          maxWidth: "960px",
          margin: "0 auto 1.5rem",
          lineHeight: 1.15
        }}>
          We Engineer High-Performance <span className="gradient-accent">Web Applications</span> & Bespoke Platforms
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
          color: "var(--text-muted)",
          maxWidth: "760px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.6
        }}>
          From scalable SaaS platforms and luxury e-commerce to custom enterprise dashboards.
          Engineered with strict TypeScript, Supabase RLS security, and instant global speed.
        </p>

        {/* Primary CTA Buttons */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.2rem",
          flexWrap: "wrap",
          marginBottom: "4.5rem"
        }}>
          <a href="#configurator" className="btn btn-primary" style={{ padding: "0.9rem 2.2rem", fontSize: "1.05rem" }} id="hero-start-project-btn">
            <span>Configure Your Project</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#tracker" className="btn btn-secondary" style={{ padding: "0.9rem 1.8rem", fontSize: "1.05rem" }} id="hero-track-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Track Existing Request</span>
          </a>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          maxWidth: "1050px",
          margin: "0 auto"
        }}>
          <div className="glass-card" style={{ padding: "1.5rem 1.2rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--accent-secondary)", marginBottom: "0.3rem" }}>
              &lt; 1.2s
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Sub-second Load Time</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Edge-rendered & optimized Core Web Vitals.</div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem 1.2rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--accent-primary)", marginBottom: "0.3rem" }}>
              100%
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Strict Type Safety</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Zero untyped state, Zod validated end-to-end.</div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem 1.2rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--accent-emerald)", marginBottom: "0.3rem" }}>
              RLS
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Bank-Grade Security</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Supabase row-level policies & encrypted data.</div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem 1.2rem", textAlign: "left" }}>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--accent-gold)", marginBottom: "0.3rem" }}>
              AI Ready
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Autonomous Specs</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Live Claude & ChatGPT prompt extraction.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
