import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navigation } from "@/components/layout/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { Suspense } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "TRIXTECH - Event Booking System",
  description: "Professional event planning, equipment rental, and catering services",
  generator: "v0.app",
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
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <Navigation />
            <main>{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
