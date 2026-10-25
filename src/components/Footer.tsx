"use client";

import React from "react";

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      padding: "4.5rem 0 2.5rem",
      backgroundColor: "var(--bg-secondary)",
      marginTop: "6rem"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3.5rem"
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1rem",
                color: "#ffffff"
              }}>
                M
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.15rem" }}>
                MMK <span style={{ color: "var(--accent-primary)" }}>AGENCY</span>
              </div>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "320px", marginBottom: "1.2rem" }}>
              High-performance web architecture, bespoke application engineering, and autonomous digital solutions for modern businesses.
            </p>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Direct Agency Inquiries: <a href="mailto:mm0491762@gmail.com" style={{ color: "#a5b4fc", textDecoration: "underline" }}>mm0491762@gmail.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.2rem", color: "var(--text-main)" }}>
              Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <a href="#services">Specialized Services</a>
              <a href="#configurator">Interactive Project Builder</a>
              <a href="#tracker">Status & Telemetry Tracker</a>
              <a href="#capabilities">Engineering Standards</a>
            </div>
          </div>

          {/* Standards & Security */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.2rem", color: "var(--text-main)" }}>
              Security & Guarantees
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <div>🛡️ Row-Level Security (RLS)</div>
              <div>⚡ Idempotent API Transmission</div>
              <div>🔒 Least Privilege DB Policies</div>
              <div>🚀 Sub-second Global Delivery</div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.85rem",
          color: "var(--text-dim)"
        }}>
          <div>
            © {new Date().getFullYear()} MMK Digital Agency. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <span>TypeScript Certified</span>
            <span>Next.js 15 Native</span>
            <a href="/admin" title="Operations Portal" style={{ color: "var(--text-dim)", textDecoration: "none", opacity: 0.5, transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}>
              🔒 Staff
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
