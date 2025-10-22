"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { PageLoading } from "@/components/ui/loading";

interface BookingData {
  id: string;
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
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadBookings();
  }, [isAuthenticated, router]);

  const loadBookings = async () => {
    try {
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform bookings to match component interface
        const transformedBookings = (data.bookings || []).map(
          (booking: any) => ({
            id: booking._id,
            service: booking.serviceName,
            serviceId: booking.serviceId,
            date: new Date(booking.date).toLocaleDateString(),
            name: booking.customerName,
            email: booking.email,
            phone: booking.phone,
            guests: booking.guests.toString(),
            notes: booking.specialRequests || "",
            status: booking.status,
            createdAt: new Date(booking.createdAt).toLocaleDateString(),
            totalAmount: booking.totalPrice,
            paymentStatus: booking.status === "confirmed" ? "paid" : "pending",
          })
        );
        setBookings(transformedBookings);
      } else {
        console.error("Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const deleteBooking = async (bookingId: string) => {
    try {
      if (!token) return;

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove from local state
        const updatedBookings = bookings.filter(
          (booking) => booking.id !== bookingId
        );
        setBookings(updatedBookings);
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
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
          <Alert className="mb-8 border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
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
