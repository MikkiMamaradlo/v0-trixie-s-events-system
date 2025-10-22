"use client";

import type React from "react";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Clock,
  Users,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
  },
  {
    id: 2,
    name: "Birthday Party Package",
    category: "party-planning",
    description: "Themed birthday celebration planning",
    price: 800,
    duration: "4 hours",
    capacity: "Up to 50 guests",
  },
  {
    id: 3,
    name: "Wedding Planning",
    category: "party-planning",
    description: "Comprehensive wedding planning services",
    price: 3500,
    duration: "Full day",
    capacity: "Up to 300 guests",
  },
  {
    id: 4,
    name: "Table & Chair Set",
    category: "equipment-rental",
    description: "Round tables with elegant chair covers",
    price: 150,
    duration: "24 hours",
    capacity: "10 seats per set",
  },
  {
    id: 5,
    name: "Sound System Package",
    category: "equipment-rental",
    description: "Professional audio equipment for events",
    price: 300,
    duration: "24 hours",
    capacity: "Up to 200 people",
  },
  {
    id: 6,
    name: "Party Tent",
    category: "equipment-rental",
    description: "Large outdoor event tent",
    price: 500,
    duration: "48 hours",
    capacity: "Up to 100 guests",
  },
  {
    id: 7,
    name: "Buffet Catering",
    category: "catering",
    description: "All-you-can-eat buffet with multiple dishes",
    price: 35,
    duration: "3 hours",
    capacity: "Per person",
  },
  {
    id: 8,
    name: "Plated Dinner Service",
    category: "catering",
    description: "Elegant plated meal service",
    price: 55,
    duration: "4 hours",
    capacity: "Per person",
  },
  {
    id: 9,
    name: "Cocktail Reception",
    category: "catering",
    description: "Appetizers and drinks for cocktail hour",
    price: 25,
    duration: "2 hours",
    capacity: "Per person",
  },
];

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const serviceId = Number.parseInt(resolvedParams.id);
  const service = services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    notes: "",
  });
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [step, setStep] = useState<"details" | "payment">("details");

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Service Not Found</CardTitle>
            <CardDescription>
              The requested service could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/services">Back to Services</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateTotal = () => {
    if (service.category === "catering" && formData.guests) {
      return service.price * Number.parseInt(formData.guests);
    }
    return service.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Store booking in localStorage
    const booking = {
      id: Date.now(),
      service: service.name,
      serviceId: service.id,
      date: date?.toISOString(),
      ...formData,
      status: "pending", // Start as pending for admin approval
      totalAmount: calculateTotal(),
      paymentStatus: "pending", // Payment pending admin approval
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      localStorage.setItem(
        "bookings",
        JSON.stringify([...existingBookings, booking])
      );

      // Notify admin via WebSocket
      try {
        await fetch("/api/notify-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "new_booking",
            booking: {
              id: booking.id,
              service: booking.service,
              name: booking.name,
              email: booking.email,
              totalAmount: booking.totalAmount,
              createdAt: booking.createdAt,
            },
          }),
        });
      } catch (error) {
        console.error("Failed to notify admin:", error);
      }
    }

    router.push("/bookings?success=true");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const proceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">₱{service.price}</span>
                {service.category === "catering" && (
                  <span className="text-muted-foreground">per person</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{service.capacity}</span>
              </div>
              {formData.guests && service.category === "catering" && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-primary">₱{calculateTotal()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {step === "details" ? (
            <Card>
              <CardHeader>
                <CardTitle>Book This Service</CardTitle>
                <CardDescription>
                  Fill in your details to reserve this service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={proceedToPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      name="guests"
                      type="number"
                      required
                      value={formData.guests}
                      onChange={handleInputChange}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or requests..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!date}
                  >
                    Proceed to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Complete your booking with secure payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {date ? format(date, "PPP") : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Guests:</span>
                      <span className="font-medium">{formData.guests}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span>Total Amount:</span>
                      <span className="text-primary">₱{calculateTotal()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep("details")}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" size="lg">
                      Complete Booking
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Demo mode: No actual payment will be processed
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
