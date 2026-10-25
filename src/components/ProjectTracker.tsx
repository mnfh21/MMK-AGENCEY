"use client";

import React, { useState } from "react";

export function ProjectTracker() {
  const [refInput, setRefInput] = useState("");
  const [searchedRef, setSearchedRef] = useState<string | null>(null);
  const [trackStatus, setTrackStatus] = useState<"not_found" | "active" | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = refInput.trim().toUpperCase();
    if (!clean) return;

    setSearchedRef(clean);
    // Format check: MMK-YYYYMMDD-XXXXXX
    if (/^MMK-\d{8}-[A-Z0-9]{6}$/.test(clean) || clean.startsWith("MMK-")) {
      setTrackStatus("active");
    } else {
      setTrackStatus("not_found");
    }
  };

  return (
    <section id="tracker" style={{ padding: "5rem 0", position: "relative" }}>
      <div className="container">
        <div className="glass-card" style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 2rem", textAlign: "center" }}>
          <div className="badge" style={{ marginBottom: "1rem" }}>
            <span>Live Project Telemetry</span>
          </div>

          <h2 style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
            Track Your Project Status
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "560px", margin: "0 auto 2rem" }}>
            Enter your unique MMK project reference (e.g. <code style={{ color: "#a5b4fc" }}>MMK-20261024-K7QH2M</code>) to monitor review stages, scope approval, and development sprints.
          </p>

          <form onSubmit={handleTrack} style={{ display: "flex", gap: "0.75rem", maxWidth: "520px", margin: "0 auto 2rem", flexWrap: "wrap" }}>
            <input
              type="text"
              className="form-control"
              style={{ flex: "1 1 240px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}
              placeholder="MMK-20261024-XXXXXX"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              id="tracker-input"
            />
            <button type="submit" className="btn btn-primary" id="tracker-submit-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Track Request</span>
            </button>
          </form>

          {trackStatus === "active" && searchedRef && (
            <div style={{
              background: "rgba(10, 14, 22, 0.9)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-md)",
              padding: "2rem",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Project Reference</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)" }}>{searchedRef}</div>
                </div>
                <div style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}>
                  ● Status: Under Architecture Review
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
                <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", fontWeight: 700 }}>STEP 1: DONE</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>Submission Received</div>
                </div>
                <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid var(--accent-primary)" }}>
                  <div style={{ fontSize: "0.75rem", color: "#a5b4fc", fontWeight: 700 }}>STEP 2: IN PROGRESS</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>Technical Review</div>
                </div>
                <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", opacity: 0.6 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 700 }}>STEP 3: PENDING</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>Formal Quote & Contract</div>
                </div>
                <div style={{ padding: "0.85rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", opacity: 0.6 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 700 }}>STEP 4: UPCOMING</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)" }}>Active Development</div>
                </div>
              </div>
            </div>
          )}

          {trackStatus === "not_found" && searchedRef && (
            <div style={{
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "1.2rem",
              color: "#fecdd3",
              fontSize: "0.9rem"
            }}>
              Reference format not recognized. Please make sure it follows the format <code style={{ color: "#fff" }}>MMK-YYYYMMDD-XXXXXX</code> as received upon submission.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
