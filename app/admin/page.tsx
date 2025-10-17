"use client";

import { useState, useEffect } from "react";
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
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  Settings,
  UserCheck,
  FileText,
} from "lucide-react";
import { BookingsManagement } from "@/components/admin/bookings-management";
import { InventoryManagement } from "@/components/admin/inventory-management";
import { CalendarView } from "@/components/admin/calendar-view";
import { UserManagement } from "@/components/admin/user-management";
import { ReportsAnalytics } from "@/components/admin/reports-analytics";
import { useAuth } from "@/lib/auth-context";
import { AdminLogin } from "@/components/admin/admin-login";
import Link from "next/link";
import { PageLoading } from "@/components/ui/loading";

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

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    totalUsers: 0,
    thisMonthRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Set loading to false after auth state is determined
    setIsLoading(false);
  }, [isAdmin]);

  const loadData = () => {
    if (typeof window !== "undefined") {
      const storedBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const storedInventory = JSON.parse(
        localStorage.getItem("inventory") || "[]"
      );

      setBookings(storedBookings);

      // Calculate stats
      const pending = storedBookings.filter(
        (b: Booking) => b.status === "pending"
      ).length;
      const confirmed = storedBookings.filter(
        (b: Booking) => b.status === "confirmed"
      ).length;
      const cancelled = storedBookings.filter(
        (b: Booking) => b.status === "cancelled"
      ).length;

      const totalRevenue = storedBookings
        .filter((b: Booking) => b.paymentStatus === "paid")
        .reduce((sum: number, b: Booking) => sum + (b.totalAmount || 500), 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthRevenue = storedBookings
        .filter(
          (b: Booking) =>
            b.paymentStatus === "paid" && new Date(b.createdAt) >= thisMonth
        )
        .reduce((sum: number, b: Booking) => sum + (b.totalAmount || 500), 0);

      const lowStockItems = storedInventory.filter(
        (item: { available: number }) => item.available < 5
      ).length;

      setStats({
        totalBookings: storedBookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        cancelledBookings: cancelled,
        totalRevenue,
        lowStockItems,
        totalUsers: storedUsers.length,
        thisMonthRevenue,
      });
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <div className="hidden md:flex space-x-6">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === "bookings" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </Button>
              <Button
                variant={activeTab === "inventory" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("inventory")}
              >
                Equipment
              </Button>
              <Button
                variant={activeTab === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("calendar")}
              >
                Calendar
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("users")}
              >
                Users
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("reports")}
              >
                Reports
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Settings className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("adminAuth");
                router.push("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3">
          <div className="flex space-x-2 overflow-x-auto">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("bookings")}
            >
              Bookings
            </Button>
            <Button
              variant={activeTab === "inventory" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("inventory")}
            >
              Equipment
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("users")}
            >
              Users
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage bookings, equipment, and calendar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                ₱{stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalBookings}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {stats.pendingBookings}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Confirmed
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {stats.confirmedBookings}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
                This Month
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                ₱{stats.thisMonthRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">
                Low Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {stats.lowStockItems}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                {stats.totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Cancelled
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.cancelledBookings}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest bookings and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/20 bg-gradient-to-r from-background to-muted/20"
                      >
                        <div>
                          <p className="font-medium">{booking.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.name}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-700"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-700"
                              : "bg-red-500/10 text-red-700"
                          } hover:scale-105 transition-transform duration-200`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">
                        No recent activity
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setActiveTab("bookings")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Bookings
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link href="/admin/payments">
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Payments
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setActiveTab("reports")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "bookings" && (
            <BookingsManagement bookings={bookings} onUpdate={loadData} />
          )}

          {activeTab === "inventory" && <InventoryManagement />}

          {activeTab === "calendar" && <CalendarView bookings={bookings} />}

          {activeTab === "users" && <UserManagement />}

          {activeTab === "reports" && <ReportsAnalytics bookings={bookings} />}
        </div>
      </div>
    </div>
  );
}
