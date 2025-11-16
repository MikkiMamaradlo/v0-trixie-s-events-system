"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) return <div className="p-8">Loading services...</div>;
  if (error) return <div className="p-8 text-destructive">{error}</div>;

  const categories = {
    "party-planning": "Party Planning",
    "equipment-rental": "Equipment Rental",
    catering: "Catering",
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Available Services</h1>

        {Object.entries(categories).map(([key, label]) => (
          <div key={key} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{label}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services
                .filter((s) => s.category === key)
                .map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${service.price}</span>
                      <Button asChild>
                        <Link href={`/booking/${service.id}`}>Book Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
