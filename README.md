# MMK Digital Agency

A high-performance modern web platform and project engineering portal built with Next.js 15, TypeScript, and Supabase.

## Features

- **Interactive Project Configurator**: Guided multi-step brief creator calculating real-time budget and timeline estimates.
- **Admin Command Portal (`/admin`)**: Operations dashboard for project telemetry, client reviews, sprint milestones, and status management.
- **Real-Time Tracking (`/ #tracker`)**: Client-facing telemetry lookup by project reference code.
- **Row-Level Security (RLS)**: PostgreSQL schema protected by granular Supabase policies and service-role server validation.
- **Resend Email Notifications**: Automated notifications for new project submissions with admin dashboard links.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions & Route Handlers)
- **Language**: TypeScript 5.5
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **Styling**: Vanilla Modern CSS Design System (Custom Glassmorphism, Dark Aesthetic)
- **Validation & Testing**: Zod, Vitest

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=MMK Digital Agency <hello@yourdomain.com>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
AGENCY_NOTIFY_EMAIL=mm0491762@gmail.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client experience or [http://localhost:3000/admin](http://localhost:3000/admin) to view the Admin Operations Portal.

### 4. Database Migrations
Run the migration file located in `supabase/migrations/0001_init.sql` inside your Supabase SQL editor.
