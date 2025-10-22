"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Package,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

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

interface ReportsAnalyticsProps {
  bookings: BookingData[];
}

export function ReportsAnalytics({ bookings }: ReportsAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredBookings = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "1month":
        startDate = subMonths(now, 1);
        break;
      case "3months":
        startDate = subMonths(now, 3);
        break;
      case "6months":
        startDate = subMonths(now, 6);
        break;
      case "1year":
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 6);
    }

    return bookings.filter(
      (booking) => new Date(booking.createdAt) >= startDate
    );
  }, [bookings, timeRange]);

  const analytics = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const confirmedBookings = filteredBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const cancelledBookings = filteredBookings.filter(
      (b) => b.status === "cancelled"
    ).length;
    const pendingBookings = filteredBookings.filter(
      (b) => b.status === "pending"
    ).length;

    const totalRevenue = filteredBookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.totalAmount || 500), 0);

    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Service popularity
    const serviceStats = filteredBookings.reduce((acc, booking) => {
      acc[booking.service] = (acc[booking.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topServices = Object.entries(serviceStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Monthly revenue trend
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));

      const monthBookings = filteredBookings.filter(
        (booking) =>
          isWithinInterval(new Date(booking.createdAt), {
            start: monthStart,
            end: monthEnd,
          }) && booking.paymentStatus === "paid"
      );

      const revenue = monthBookings.reduce(
        (sum, b) => sum + (b.totalAmount || 500),
        0
      );

      monthlyRevenue.push({
        month: format(monthStart, "MMM yyyy"),
        revenue,
        bookings: monthBookings.length,
      });
    }

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      pendingBookings,
      totalRevenue,
      averageBookingValue,
      topServices,
      monthlyRevenue,
      conversionRate:
        totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0,
    };
  }, [filteredBookings]);

  const previousPeriodBookings = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeRange) {
      case "1month":
        startDate = subMonths(now, 2);
        endDate = subMonths(now, 1);
        break;
      case "3months":
        startDate = subMonths(now, 6);
        endDate = subMonths(now, 3);
        break;
      case "6months":
        startDate = subMonths(now, 12);
        endDate = subMonths(now, 6);
        break;
      case "1year":
        startDate = subMonths(now, 24);
        endDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 12);
        endDate = subMonths(now, 6);
    }

    return bookings.filter(
      (booking) =>
        new Date(booking.createdAt) >= startDate &&
        new Date(booking.createdAt) < endDate
    );
  }, [bookings, timeRange]);

  const previousAnalytics = useMemo(() => {
    const totalRevenue = previousPeriodBookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.totalAmount || 500), 0);

    return {
      totalRevenue,
      totalBookings: previousPeriodBookings.length,
    };
  }, [previousPeriodBookings]);

  const revenueChange =
    previousAnalytics.totalRevenue > 0
      ? ((analytics.totalRevenue - previousAnalytics.totalRevenue) /
          previousAnalytics.totalRevenue) *
        100
      : 0;

  const bookingsChange =
    previousAnalytics.totalBookings > 0
      ? ((analytics.totalBookings - previousAnalytics.totalBookings) /
          previousAnalytics.totalBookings) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{analytics.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {revenueChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  revenueChange >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(revenueChange).toFixed(1)}%
              </span>
              <span className="ml-1">vs previous period</span>
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
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {bookingsChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  bookingsChange >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(bookingsChange).toFixed(1)}%
              </span>
              <span className="ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Booking Value
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{analytics.averageBookingValue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Confirmed bookings
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Breakdown</CardTitle>
                <CardDescription>
                  Distribution of booking statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {analytics.confirmedBookings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {analytics.totalBookings > 0
                          ? (
                              (analytics.confirmedBookings /
                                analytics.totalBookings) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {analytics.pendingBookings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {analytics.totalBookings > 0
                          ? (
                              (analytics.pendingBookings /
                                analytics.totalBookings) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Cancelled</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {analytics.cancelledBookings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {analytics.totalBookings > 0
                          ? (
                              (analytics.cancelledBookings /
                                analytics.totalBookings) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>
                  Revenue and bookings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.monthlyRevenue.map((month, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{month.month}</div>
                        <div className="text-sm text-muted-foreground">
                          {month.bookings} bookings
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ₱{month.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
              <CardDescription>
                Most popular services by booking count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topServices.map(([service, count], index) => (
                  <div
                    key={service}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-semibold text-primary">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{service}</div>
                        <div className="text-sm text-muted-foreground">
                          {count} bookings
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {analytics.totalBookings > 0
                        ? ((count / analytics.totalBookings) * 100).toFixed(1)
                        : 0}
                      %
                    </Badge>
                  </div>
                ))}
                {analytics.topServices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No service data available for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(
                    ...analytics.monthlyRevenue.map((m) => m.revenue)
                  );
                  const percentage =
                    maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span>₱{month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
