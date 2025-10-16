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
  paymentStatus?: string;
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalBookings}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                Upcoming Events
              </CardTitle>
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {stats.upcomingBookings}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Total Spent
              </CardTitle>
              <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                ₱{stats.totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Across all bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Book Services
              </CardTitle>
              <CardDescription>
                Browse and book our event services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Link href="/services">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                View Bookings
              </CardTitle>
              <CardDescription>
                Manage your existing reservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/40"
              >
                <Link href="/bookings">My Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="hover:shadow-lg transition-all duration-300">
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
                <Button
                  asChild
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/20 bg-gradient-to-r from-background to-muted/20"
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
                    <Badge
                      className={`${getStatusColor(
                        booking.status
                      )} hover:scale-105 transition-transform duration-200`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </div>
                ))}
                {bookings.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                    >
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
