"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Client {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  country: string;
}

interface ProjectNote {
  id: string;
  content: string;
  created_at: string;
}

interface Project {
  id: string;
  reference: string;
  project_type: string;
  budget: string;
  timeline?: string | null;
  status: "new" | "under_review" | "awaiting_client" | "quoted" | "approved" | "in_progress" | "completed" | "cancelled";
  agreed_price?: number | null;
  expected_delivery?: string | null;
  submitted_at: string;
  updated_at?: string;
  clients: Client;
  config?: {
    business?: { name?: string; category?: string };
    projectType?: string;
    budget?: string;
    timeline?: string;
    pages?: string[];
    features?: string[];
    design?: { style?: string; inspiration?: string };
    notes?: string;
    client?: { company?: string | null; preferredContact?: string };
  };
  project_notes?: ProjectNote[];
}

const DEFAULT_STATUS = { label: "New Request", bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" };

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  new: DEFAULT_STATUS,
  under_review: { label: "Under Review", bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  awaiting_client: { label: "Awaiting Client", bg: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "rgba(168, 85, 247, 0.3)" },
  quoted: { label: "Quoted", bg: "rgba(6, 182, 212, 0.15)", color: "#22d3ee", border: "rgba(6, 182, 212, 0.3)" },
  approved: { label: "Approved", bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  in_progress: { label: "In Progress", bg: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", border: "rgba(99, 102, 241, 0.4)" },
  completed: { label: "Completed", bg: "rgba(34, 197, 94, 0.2)", color: "#4ade80", border: "rgba(34, 197, 94, 0.4)" },
  cancelled: { label: "Cancelled", bg: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
};

function AdminContent() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("project") || searchParams.get("id");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Form states for selected project update
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editDelivery, setEditDelivery] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [updateMsg, setUpdateMsg] = useState<{ text: string; success: boolean } | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        setProjects(json.data);
        if (initialProjectId) {
          const match = json.data.find((p: Project) => p.id === initialProjectId || p.reference === initialProjectId);
          if (match) openProjectModal(match);
        }
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [initialProjectId]);

  const openProjectModal = (p: Project) => {
    setSelectedProject(p);
    setEditStatus(p.status);
    setEditPrice(p.agreed_price ? String(p.agreed_price) : "");
    setEditDelivery(p.expected_delivery ? p.expected_delivery.slice(0, 10) : "");
    setNewNote("");
    setUpdateMsg(null);
  };

  const handleCopyRef = (ref: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;
    setUpdating(true);
    setUpdateMsg(null);

    try {
      const payload: Record<string, any> = {
        status: editStatus,
        agreed_price: editPrice ? parseFloat(editPrice) : null,
        expected_delivery: editDelivery || null,
        note: newNote.trim() || undefined,
      };

      const res = await fetch(`/api/admin/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.ok) {
        setUpdateMsg({ text: "Project updated successfully!", success: true });
        // Update local state
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === selectedProject.id) {
              const updatedNotes = newNote.trim()
                ? [...(p.project_notes || []), { id: `local-${Date.now()}`, content: newNote.trim(), created_at: new Date().toISOString() }]
                : p.project_notes;
              return {
                ...p,
                status: editStatus as any,
                agreed_price: editPrice ? parseFloat(editPrice) : null,
                expected_delivery: editDelivery || null,
                project_notes: updatedNotes,
              };
            }
            return p;
          })
        );
        setSelectedProject((prev) =>
          prev
            ? {
                ...prev,
                status: editStatus as any,
                agreed_price: editPrice ? parseFloat(editPrice) : null,
                expected_delivery: editDelivery || null,
                project_notes: newNote.trim()
                  ? [...(prev.project_notes || []), { id: `local-${Date.now()}`, content: newNote.trim(), created_at: new Date().toISOString() }]
                  : prev.project_notes,
              }
            : null
        );
        setNewNote("");
      } else {
        setUpdateMsg({ text: json.error || "Update failed", success: false });
      }
    } catch (err) {
      setUpdateMsg({ text: "Network error occurred", success: false });
    } finally {
      setUpdating(false);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = projects.length;
    const newCount = projects.filter((p) => p.status === "new").length;
    const reviewCount = projects.filter((p) => p.status === "under_review").length;
    const inProgressCount = projects.filter((p) => p.status === "in_progress").length;
    const completedCount = projects.filter((p) => p.status === "completed").length;
    return { total, newCount, reviewCount, inProgressCount, completedCount };
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchTab =
        activeTab === "all" ? true :
        activeTab === "pending" ? ["new", "under_review", "awaiting_client"].includes(p.status) :
        p.status === activeTab;

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.reference.toLowerCase().includes(q) ||
        p.clients?.name?.toLowerCase().includes(q) ||
        p.clients?.email?.toLowerCase().includes(q) ||
        p.project_type?.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [projects, activeTab, search]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}>
      {/* Admin Top Navigation */}
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "rgba(10, 13, 20, 0.85)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
            padding: "0 1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>MMK</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px",
                    background: "rgba(99, 102, 241, 0.2)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Admin Command
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Agency Engineering Operations</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "8px",
                border: "1px solid var(--border-medium)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              <span>Back to Public Site</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ padding: "2.5rem 1.5rem 5rem" }}>
        {/* Header Intro */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 2.5vw, 2.4rem)", fontWeight: 800, marginBottom: "0.5rem" }}>
            Project Pipeline & Client Telemetry
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Monitor inbound client configurations, update engineering stages, and manage production timelines.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Total Requests
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
              {stats.total}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-primary)", marginTop: "0.25rem" }}>
              All pipeline history
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#60a5fa", textTransform: "uppercase", fontWeight: 700 }}>
              New Submissions
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
              {stats.newCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Requires initial review
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#fbbf24", textTransform: "uppercase", fontWeight: 700 }}>
              Under Architecture Review
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
              {stats.reviewCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Scope & budget check
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#a5b4fc", textTransform: "uppercase", fontWeight: 700 }}>
              In Active Development
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
              {stats.inProgressCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Engineering sprints
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#34d399", textTransform: "uppercase", fontWeight: 700 }}>
              Completed Projects
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
              {stats.completedCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Delivered successfully
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { id: "all", label: "All Projects" },
              { id: "pending", label: "Pending Review" },
              { id: "in_progress", label: "In Progress" },
              { id: "approved", label: "Approved" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: activeTab === tab.id ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                  backgroundColor: activeTab === tab.id ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: "relative", minWidth: "260px" }}>
            <input
              type="text"
              placeholder="Search reference, client, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: "2.4rem", fontSize: "0.85rem" }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Projects List / Table */}
        {loading ? (
          <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "1rem", color: "var(--text-muted)" }}>Loading project telemetry...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>No projects found</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {search ? `No projects match your search query "${search}".` : "No project submissions in this category yet."}
            </p>
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              padding: "0",
              overflow: "hidden",
              border: "1px solid var(--border-medium)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-medium)", background: "rgba(255, 255, 255, 0.02)" }}>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>Reference</th>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>Client / Business</th>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>Scope / Type</th>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>Budget / Timeline</th>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>Status</th>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => {
                    const st = STATUS_CONFIG[p.status] ?? DEFAULT_STATUS;
                    return (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: "1px solid var(--border-subtle)",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {/* Reference */}
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <button
                            onClick={(e) => handleCopyRef(p.reference, e)}
                            title="Click to copy reference"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              background: "rgba(99, 102, 241, 0.1)",
                              border: "1px solid rgba(99, 102, 241, 0.3)",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "6px",
                              color: "#a5b4fc",
                              fontFamily: "monospace",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            <span>{p.reference}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {copiedRef === p.reference ? (
                                <polyline points="20 6 9 17 4 12"></polyline>
                              ) : (
                                <>
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </>
                              )}
                            </svg>
                          </button>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.35rem" }}>
                            {new Date(p.submitted_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Client */}
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{p.clients?.name || "Anonymous"}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.clients?.email}</div>
                          {p.config?.business?.name && (
                            <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", marginTop: "0.2rem" }}>
                              🏢 {p.config.business.name}
                            </div>
                          )}
                        </td>

                        {/* Project Type */}
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <div style={{ fontWeight: 600 }}>{p.project_type}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                            {p.config?.pages ? `${p.config.pages.length} Pages` : ""}{" "}
                            {p.config?.features ? `• ${p.config.features.length} Features` : ""}
                          </div>
                        </td>

                        {/* Budget & Timeline */}
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <div style={{ fontWeight: 600, color: "#34d399" }}>{p.budget}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.timeline || "Not specified"}</div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "20px",
                              backgroundColor: st.bg,
                              color: st.color,
                              border: `1px solid ${st.border}`,
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            ● {st.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                          <button
                            onClick={() => openProjectModal(p)}
                            className="btn btn-secondary"
                            style={{
                              padding: "0.45rem 0.9rem",
                              fontSize: "0.85rem",
                              borderRadius: "8px",
                            }}
                          >
                            <span>Inspect & Update</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Project Details Modal / Drawer */}
        {selectedProject && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 100,
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => setSelectedProject(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                height: "100%",
                backgroundColor: "#0d111a",
                borderLeft: "1px solid var(--border-medium)",
                padding: "2.5rem 2rem",
                overflowY: "auto",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Project Inspection
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{selectedProject.reference}</span>
                    <button
                      onClick={(e) => handleCopyRef(selectedProject.reference, e)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#a5b4fc",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Status Update Alert */}
              {updateMsg && (
                <div
                  style={{
                    padding: "0.85rem 1.25rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                    backgroundColor: updateMsg.success ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: updateMsg.success ? "#4ade80" : "#f87171",
                    border: updateMsg.success ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {updateMsg.text}
                </div>
              )}

              {/* Management Controls Box */}
              <div
                style={{
                  background: "rgba(99, 102, 241, 0.06)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#a5b4fc" }}>
                  Engineering Controls & State
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                      Project Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="form-control"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <option value="new">New Request</option>
                      <option value="under_review">Under Technical Review</option>
                      <option value="awaiting_client">Awaiting Client Response</option>
                      <option value="quoted">Formal Quote Sent</option>
                      <option value="approved">Approved & Funded</option>
                      <option value="in_progress">Active Development</option>
                      <option value="completed">Completed & Deployed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                      Agreed Price ($ USD)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="form-control"
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={editDelivery}
                    onChange={(e) => setEditDelivery(e.target.value)}
                    className="form-control"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    Add Internal Note
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Log architectural feedback, client calls, or sprint milestones..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="form-control"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>

                <button
                  onClick={handleSaveProject}
                  disabled={updating}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "0.6rem" }}
                >
                  <span>{updating ? "Saving Changes..." : "Commit Updates"}</span>
                </button>
              </div>

              {/* Client & Business Section */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
                  Client Contact Profile
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.88rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Name: </span>
                    <strong style={{ color: "#fff" }}>{selectedProject.clients?.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Email: </span>
                    <a href={`mailto:${selectedProject.clients?.email}`} style={{ color: "#a5b4fc", textDecoration: "underline" }}>
                      {selectedProject.clients?.email}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Phone: </span>
                    <span>{selectedProject.clients?.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Country: </span>
                    <span>{selectedProject.clients?.country}</span>
                  </div>
                </div>
              </div>

              {/* Scope & Specification */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
                  Technical Scope & Architecture
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Project Type: </span>
                    <strong style={{ color: "#fff" }}>{selectedProject.project_type}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Budget Range: </span>
                    <span style={{ color: "#34d399", fontWeight: 700 }}>{selectedProject.budget}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Timeline Expectation: </span>
                    <span>{selectedProject.timeline || "Flexible"}</span>
                  </div>
                  {selectedProject.config?.design?.style && (
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Design Style: </span>
                      <span>{selectedProject.config.design.style}</span>
                    </div>
                  )}
                  {selectedProject.config?.pages && selectedProject.config.pages.length > 0 && (
                    <div>
                      <div style={{ color: "var(--text-muted)", marginBottom: "0.3rem" }}>Configured Pages:</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {selectedProject.config.pages.map((p, i) => (
                          <span
                            key={i}
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProject.config?.features && selectedProject.config.features.length > 0 && (
                    <div>
                      <div style={{ color: "var(--text-muted)", marginBottom: "0.3rem" }}>Selected Features:</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {selectedProject.config.features.map((f, i) => (
                          <span
                            key={i}
                            style={{
                              background: "rgba(99, 102, 241, 0.15)",
                              color: "#a5b4fc",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                            }}
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProject.config?.notes && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <div style={{ color: "var(--text-muted)", marginBottom: "0.3rem" }}>Client Direct Notes:</div>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          padding: "0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        {selectedProject.config.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Past Notes Log */}
              {selectedProject.project_notes && selectedProject.project_notes.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
                    Internal Engineering Log
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedProject.project_notes.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--border-subtle)",
                          fontSize: "0.85rem",
                        }}
                      >
                        <div style={{ color: "#fff", marginBottom: "0.3rem" }}>{n.content}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                          {new Date(n.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "#fff" }}>Loading Admin Portal...</div>}>
      <AdminContent />
    </Suspense>
  );
}
