"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Calendar, Package, Utensils, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Welcome to TRIXTECH Event Booking
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
              Professional event planning, premium equipment rentals, and exceptional catering services all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={isAuthenticated ? "/services" : "/login"}>
                  {isAuthenticated ? "Browse Services" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ServiceCard
              icon={Calendar}
              title="Party Planning"
              description="Complete event coordination from concept to execution."
            />
            <ServiceCard
              icon={Package}
              title="Equipment Rental"
              description="Premium tables, chairs, tents, sound systems, and more."
            />
            <ServiceCard
              icon={Utensils}
              title="Catering"
              description="Delicious menus crafted for any occasion."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
      <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
