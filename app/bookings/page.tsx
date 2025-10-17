"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Booking {
  id: number;
  service: string;
  serviceId: number;
  date: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  totalAmount?: number;
  paymentStatus?: string;
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      setBookings(storedBookings);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const deleteBooking = (bookingId: number) => {
    if (typeof window !== "undefined") {
      const updatedBookings = bookings.filter(
        (booking) => booking.id !== bookingId
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Bookings</h1>
          <p className="text-lg text-muted-foreground">
            View and manage your event reservations
          </p>
        </div>

        {success && (
          <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
            <CheckCircle2 className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              Your booking has been submitted successfully! It is currently
              pending admin approval. We'll contact you once it's confirmed.
            </AlertDescription>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>No Bookings Yet</CardTitle>
              <CardDescription>
                You haven't made any reservations yet. Browse our services to
                get started!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild size="lg">
                <Link href="/services">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {booking.service}
                      </CardTitle>
                      <CardDescription>
                        Booked on {format(new Date(booking.createdAt), "PPP")}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Event Date
                          </p>
                          <p className="font-medium">
                            {booking.date
                              ? format(new Date(booking.date), "PPP")
                              : "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Guests
                          </p>
                          <p className="font-medium">{booking.guests} people</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{booking.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{booking.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">
                        Additional Notes
                      </p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBooking(booking.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
