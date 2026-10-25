"use client";

import React, { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(16px)",
      backgroundColor: "rgba(7, 9, 14, 0.75)",
      borderBottom: "1px solid var(--border-subtle)",
      transition: "all var(--transition-fast)"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px"
      }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "1.1rem",
            color: "#ffffff",
            boxShadow: "0 0 20px -2px rgba(99, 102, 241, 0.6)"
          }}>
            M
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>
              MMK <span style={{ color: "#6366f1" }}>AGENCY</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Digital Engineering
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: "none", alignItems: "center", gap: "2rem" }} className="desktop-nav">
          <a href="#services" style={{ fontSize: "0.92rem", color: "var(--text-muted)", transition: "color var(--transition-fast)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Services
          </a>
          <a href="#configurator" style={{ fontSize: "0.92rem", color: "var(--text-muted)", transition: "color var(--transition-fast)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Project Builder
          </a>
          <a href="#tracker" style={{ fontSize: "0.92rem", color: "var(--text-muted)", transition: "color var(--transition-fast)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Track Request
          </a>
          <a href="#capabilities" style={{ fontSize: "0.92rem", color: "var(--text-muted)", transition: "color var(--transition-fast)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            Tech Stack
          </a>
          <a href="/admin" style={{ fontSize: "0.85rem", color: "#a5b4fc", padding: "0.3rem 0.6rem", borderRadius: "6px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.25)" }}>
            Admin
          </a>
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="#configurator" className="btn btn-primary" id="header-cta-btn">
            <span>Start a Project</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#fff",
              border: "1px solid var(--border-subtle)"
            }}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="17" x2="20" y2="17"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: "1.2rem 1.5rem 1.8rem",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem"
        }}>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--text-main)", fontSize: "1rem" }}>Services</a>
          <a href="#configurator" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--text-main)", fontSize: "1rem" }}>Project Builder</a>
          <a href="#tracker" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--text-main)", fontSize: "1rem" }}>Track Request</a>
          <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--text-main)", fontSize: "1rem" }}>Tech Stack</a>
          <a href="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: "#a5b4fc", fontSize: "1rem" }}>⚡ Admin Portal</a>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
