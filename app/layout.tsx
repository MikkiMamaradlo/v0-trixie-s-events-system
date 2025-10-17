import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRIXTECH - Event Booking System",
  description:
    "Professional event planning, equipment rental, and catering services",
  generator: "v0.app",
  other: {
    robots: "noindex, nofollow", // Prevent search engine indexing for demo
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            {children}
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
