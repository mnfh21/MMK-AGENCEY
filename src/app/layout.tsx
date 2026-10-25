import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMK Digital Agency | High-Performance Web & Digital Engineering",
  description: "Bespoke web applications, high-conversion platforms, and enterprise cloud architecture. Engineered with Next.js, Supabase, and strict craftsmanship.",
  keywords: ["web agency", "custom web applications", "Next.js", "Supabase", "luxury web development", "AI integrations", "MMK agency"],
  authors: [{ name: "MMK Digital Agency" }],
  openGraph: {
    title: "MMK Digital Agency | Bespoke Digital Experiences",
    description: "Architecting high-converting web applications, SaaS dashboards, and digital products with supersonic performance.",
    siteName: "MMK Digital Agency",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
