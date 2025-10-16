"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Calendar, Package, Utensils, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Prevent hydration mismatch by not rendering auth-dependent content until client-side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side render: show static content without auth-dependent elements
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
                Make Your Event Unforgettable with Trixie's
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
                Professional event planning, premium equipment rentals, and
                exceptional catering services all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg bg-transparent"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Link href="/login" className="group">
                <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    Party Planning
                  </h3>
                  <p className="text-muted-foreground">
                    Complete event coordination from concept to execution. Let
                    us bring your vision to life.
                  </p>
                </div>
              </Link>

              <Link href="/login" className="group">
                <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    Equipment Rental
                  </h3>
                  <p className="text-muted-foreground">
                    Premium tables, chairs, tents, sound systems, and more.
                    Everything you need for a perfect event.
                  </p>
                </div>
              </Link>

              <Link href="/login" className="group">
                <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Utensils className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Catering</h3>
                  <p className="text-muted-foreground">
                    Delicious menus crafted for any occasion. From intimate
                    gatherings to grand celebrations.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-2xl p-12 md:p-16 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Plan Your Event?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Create an account today and let us handle the details while you
                enjoy the celebration.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Make Your Event Unforgettable with Trixie's
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
              Professional event planning, premium equipment rentals, and
              exceptional catering services all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button asChild size="lg" className="text-lg">
                  <Link href="/services">
                    Go to Services <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg">
                    <Link href="/login">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-lg bg-transparent"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link
              href={isAuthenticated ? "/services" : "/login"}
              className="group"
            >
              <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Party Planning</h3>
                <p className="text-muted-foreground">
                  Complete event coordination from concept to execution. Let us
                  bring your vision to life.
                </p>
              </div>
            </Link>

            <Link
              href={isAuthenticated ? "/services" : "/login"}
              className="group"
            >
              <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Equipment Rental
                </h3>
                <p className="text-muted-foreground">
                  Premium tables, chairs, tents, sound systems, and more.
                  Everything you need for a perfect event.
                </p>
              </div>
            </Link>

            <Link
              href={isAuthenticated ? "/services" : "/login"}
              className="group"
            >
              <div className="bg-card border rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Catering</h3>
                <p className="text-muted-foreground">
                  Delicious menus crafted for any occasion. From intimate
                  gatherings to grand celebrations.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-12 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Plan Your Event?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Create an account today and let us handle the details while you
              enjoy the celebration.
            </p>
            {isAuthenticated ? (
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/signup">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
