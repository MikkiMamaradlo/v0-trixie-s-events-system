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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  Package,
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
        (item: any) => item.available < 5
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
                Inventory
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
              Inventory
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
            Manage bookings, inventory, and calendar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold">
                ₱{stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingBookings}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-600">
                {stats.confirmedBookings}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold">
                ₱{stats.thisMonthRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-red-600">
                {stats.lowStockItems}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelledBookings}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest bookings and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{booking.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.name}
                          </p>
                        </div>
                        <Badge
                          className={
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-700"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-700"
                              : "bg-red-500/10 text-red-700"
                          }
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
                    onClick={() => setActiveTab("inventory")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Update Inventory
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
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
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
