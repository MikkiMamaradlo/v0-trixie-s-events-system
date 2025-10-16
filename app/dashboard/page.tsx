"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Package,
  Utensils,
  Clock,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

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
}

export default function CustomerDashboard() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      router.push("/login");
    }
  }, [isAuthenticated, isAdmin, router]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      loadCustomerData();
    }
  }, [isAuthenticated, isAdmin]);

  const loadCustomerData = () => {
    if (typeof window !== "undefined") {
      const storedBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      const userBookings = storedBookings.filter(
        (b: Booking) => b.email === user?.email
      );

      setBookings(userBookings);

      const upcoming = userBookings.filter(
        (b: Booking) =>
          b.status === "confirmed" && new Date(b.date) > new Date()
      ).length;

      setStats({
        totalBookings: userBookings.length,
        upcomingBookings: upcoming,
        totalSpent: userBookings.reduce(
          (total: number, booking: Booking) =>
            total + (booking.totalAmount || 0),
          0
        ),
      });
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

  if (!isAuthenticated || isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your bookings and account
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{stats.totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Book Services
              </CardTitle>
              <CardDescription>
                Browse and book our event services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/services">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                View Bookings
              </CardTitle>
              <CardDescription>
                Manage your existing reservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/bookings">My Bookings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Plan Event
              </CardTitle>
              <CardDescription>
                Get help planning your next event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/services?category=party-planning">
                  Event Planning
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Your latest reservations and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by browsing our services and making your first booking.
                </p>
                <Button asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        {booking.service.includes("Party") && (
                          <Calendar className="h-5 w-5 text-primary" />
                        )}
                        {booking.service.includes("Table") && (
                          <Package className="h-5 w-5 text-primary" />
                        )}
                        {booking.service.includes("Catering") && (
                          <Utensils className="h-5 w-5 text-primary" />
                        )}
                        {!booking.service.includes("Party") &&
                          !booking.service.includes("Table") &&
                          !booking.service.includes("Catering") && (
                            <Package className="h-5 w-5 text-primary" />
                          )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{booking.service}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.date
                            ? format(new Date(booking.date), "PPP")
                            : "Date not set"}{" "}
                          • {booking.guests} guests
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </div>
                ))}
                {bookings.length > 5 && (
                  <div className="text-center pt-4">
                    <Button asChild variant="outline">
                      <Link href="/bookings">View All Bookings</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
