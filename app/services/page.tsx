"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Package,
  Utensils,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { PageLoading } from "@/components/ui/loading";

const services = [
  {
    id: 1,
    name: "Complete Party Planning",
    category: "party-planning",
    description: "Full-service event planning from start to finish",
    price: 1500,
    duration: "8 hours",
    capacity: "Up to 200 guests",
    image: "/elegant-party-planning-setup.jpg",
    features: [
      "Event coordination",
      "Vendor management",
      "Timeline creation",
      "Day-of coordination",
    ],
  },
  {
    id: 2,
    name: "Birthday Party Package",
    category: "party-planning",
    description: "Themed birthday celebration planning",
    price: 800,
    duration: "4 hours",
    capacity: "Up to 50 guests",
    image: "/birthday-party.png",
    features: [
      "Theme design",
      "Decoration setup",
      "Activity planning",
      "Party coordination",
    ],
  },
  {
    id: 3,
    name: "Wedding Planning",
    category: "party-planning",
    description: "Comprehensive wedding planning services",
    price: 3500,
    duration: "Full day",
    capacity: "Up to 300 guests",
    image: "/elegant-wedding-setup.jpg",
    features: [
      "Venue selection",
      "Vendor coordination",
      "Design consultation",
      "Full-day coordination",
    ],
  },
  {
    id: 4,
    name: "Table & Chair Set",
    category: "equipment-rental",
    description: "Round tables with elegant chair covers",
    price: 150,
    duration: "24 hours",
    capacity: "10 seats per set",
    image: "/elegant-table-and-chairs-setup.jpg",
    features: [
      "Round tables",
      "Chair covers",
      "Table linens",
      "Setup included",
    ],
  },
  {
    id: 5,
    name: "Sound System Package",
    category: "equipment-rental",
    description: "Professional audio equipment for events",
    price: 300,
    duration: "24 hours",
    capacity: "Up to 200 people",
    image: "/professional-sound-system.jpg",
    features: ["Speakers", "Microphones", "Mixer", "Technical support"],
  },
  {
    id: 6,
    name: "Party Tent",
    category: "equipment-rental",
    description: "Large outdoor event tent",
    price: 500,
    duration: "48 hours",
    capacity: "Up to 100 guests",
    image: "/white-party-tent-outdoor.jpg",
    features: [
      "Weather protection",
      "Setup & takedown",
      "Lighting",
      "Flooring options",
    ],
  },
  {
    id: 7,
    name: "Buffet Catering",
    category: "catering",
    description: "All-you-can-eat buffet with multiple dishes",
    price: 35,
    duration: "3 hours",
    capacity: "Per person",
    image: "/elegant-buffet-catering-spread.jpg",
    features: ["3 main courses", "4 side dishes", "Dessert", "Beverages"],
  },
  {
    id: 8,
    name: "Plated Dinner Service",
    category: "catering",
    description: "Elegant plated meal service",
    price: 55,
    duration: "4 hours",
    capacity: "Per person",
    image: "/elegant-plated-dinner-service.jpg",
    features: [
      "3-course meal",
      "Professional servers",
      "Fine dining setup",
      "Custom menu",
    ],
  },
  {
    id: 9,
    name: "Cocktail Reception",
    category: "catering",
    description: "Appetizers and drinks for cocktail hour",
    price: 25,
    duration: "2 hours",
    capacity: "Per person",
    image: "/cocktail-reception-appetizers.jpg",
    features: [
      "Passed appetizers",
      "Signature cocktails",
      "Bar service",
      "Setup included",
    ],
  },
];

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "all"
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "all") return services;
    return services.filter((service) => service.category === selectedCategory);
  }, [selectedCategory]);

  // Prevent hydration mismatch by not rendering auth-dependent content until client-side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our comprehensive range of event services and equipment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            Browse our comprehensive range of event services and equipment
          </p>
        </div>

        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="party-planning">Planning</TabsTrigger>
            <TabsTrigger value="equipment-rental">Equipment</TabsTrigger>
            <TabsTrigger value="catering">Catering</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader className="p-0">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <Badge variant="secondary">
                    {service.category === "party-planning" && (
                      <Calendar className="h-3 w-3 mr-1" />
                    )}
                    {service.category === "equipment-rental" && (
                      <Package className="h-3 w-3 mr-1" />
                    )}
                    {service.category === "catering" && (
                      <Utensils className="h-3 w-3 mr-1" />
                    )}
                  </Badge>
                </div>
                <CardDescription className="mb-4">
                  {service.description}
                </CardDescription>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-foreground">
                      ₱{service.price.toLocaleString()}
                    </span>
                    {service.category === "catering" && <span>per person</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{service.capacity}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="text-sm flex items-center gap-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/booking/${service.id}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
