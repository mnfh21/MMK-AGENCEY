import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin";
import { isEnvConfigured } from "@/lib/env";
import { verifyAdminRequest } from "@/lib/auth/admin";

export const runtime = "nodejs";

// Sample fallback mock data for testing when database is empty or offline
const MOCK_PROJECTS = [
  {
    id: "demo-proj-1",
    reference: "MMK-20261025-X7K9LQ",
    project_type: "Full-Stack Web Application",
    budget: "$5,000 - $10,000",
    timeline: "4 - 8 weeks",
    status: "new",
    agreed_price: null,
    expected_delivery: null,
    submitted_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    clients: {
      name: "Ahmed Mansour",
      email: "ahmed.m@techcorp.io",
      phone: "+966 50 123 4567",
      country: "Saudi Arabia",
    },
    config: {
      business: { name: "FinFlow Solutions", category: "Fintech & Banking" },
      projectType: "Full-Stack Web Application",
      budget: "$5,000 - $10,000",
      timeline: "4 - 8 weeks",
      pages: ["Dashboard", "Transactions", "Customer Portal", "Analytics"],
      features: ["Supabase Realtime Auth", "Stripe Billing", "Interactive Charts", "Audit Log"],
      design: { style: "Sleek Dark Cyberpunk", inspiration: "Stripe & Linear" },
      notes: "Need high-performance API endpoints and automated PDF reporting.",
      client: { preferredContact: "email", company: "FinFlow" }
    },
    project_notes: [
      { id: "note-1", content: "Initial inquiry reviewed. Requirements align well with our Next.js + Supabase stack.", created_at: new Date(Date.now() - 3600000 * 2).toISOString() }
    ]
  },
  {
    id: "demo-proj-2",
    reference: "MMK-20261024-W2P4MR",
    project_type: "E-Commerce Experience",
    budget: "$3,000 - $5,000",
    timeline: "2 - 4 weeks",
    status: "in_progress",
    agreed_price: 4500,
    expected_delivery: "2026-11-20",
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    clients: {
      name: "Sarah Jenkins",
      email: "sarah@lumina-retail.com",
      phone: "+971 52 987 6543",
      country: "UAE",
    },
    config: {
      business: { name: "Lumina Lux", category: "Retail & Luxury" },
      projectType: "E-Commerce Experience",
      budget: "$3,000 - $5,000",
      timeline: "2 - 4 weeks",
      pages: ["Catalog", "Product Detail", "Checkout", "Customer Account"],
      features: ["Cart & Checkout", "Multi-Currency", "Inventory Sync"],
      design: { style: "Minimalist Modern", inspiration: "Apple Store" },
      notes: "Sprint 1 design tokens finalized and approved by client.",
      client: { preferredContact: "whatsapp", company: "Lumina" }
    },
    project_notes: [
      { id: "note-2", content: "Contract signed, deposit received. UI sprint ongoing.", created_at: new Date(Date.now() - 86400000).toISOString() }
    ]
  }
];

export async function GET(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized access. Valid admin session required." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const searchQuery = searchParams.get("q")?.toLowerCase();

  if (!isEnvConfigured()) {
    let filtered = [...MOCK_PROJECTS];
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.reference.toLowerCase().includes(searchQuery) ||
        p.clients.name.toLowerCase().includes(searchQuery) ||
        p.clients.email.toLowerCase().includes(searchQuery)
      );
    }
    return NextResponse.json({ ok: true, data: filtered, source: "mock" });
  }

  try {
    const db = adminDb();
    let query = db
      .from("projects")
      .select("*, clients(*), project_notes(*)")
      .order("submitted_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.error("admin_fetch_projects_error", error);
      return NextResponse.json({ ok: true, data: MOCK_PROJECTS, source: "fallback_error" });
    }

    let results = data ?? [];
    if (results.length === 0) {
      // If DB has no rows yet, return mock so admin UI is previewable
      results = MOCK_PROJECTS;
    }

    if (searchQuery) {
      results = results.filter((p: any) =>
        p.reference?.toLowerCase().includes(searchQuery) ||
        p.clients?.name?.toLowerCase().includes(searchQuery) ||
        p.clients?.email?.toLowerCase().includes(searchQuery) ||
        p.project_type?.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json({ ok: true, data: results, source: "database" });
  } catch (err) {
    console.error("admin_projects_api_exception", err);
    return NextResponse.json({ ok: true, data: MOCK_PROJECTS, source: "fallback_exception" });
  }
}
