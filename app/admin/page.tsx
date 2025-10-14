"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, DollarSign, Clock } from "lucide-react"
import { BookingsManagement } from "@/components/admin/bookings-management"
import { InventoryManagement } from "@/components/admin/inventory-management"
import { CalendarView } from "@/components/admin/calendar-view"
import { useAuth } from "@/lib/auth-context"
import { AdminLogin } from "@/components/admin/admin-login"

interface Booking {
  id: number
  service: string
  serviceId: number
  date: string
  name: string
  email: string
  phone: string
  guests: string
  notes: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(storedBookings)

    // Calculate stats
    const pending = storedBookings.filter((b: Booking) => b.status === "pending").length
    const confirmed = storedBookings.filter((b: Booking) => b.status === "confirmed").length

    setStats({
      totalBookings: storedBookings.length,
      pendingBookings: pending,
      confirmedBookings: confirmed,
      totalRevenue: confirmed * 500, // Mock calculation
    })
  }

  if (!isAdmin) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage bookings, inventory, and calendar</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">Active bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">From confirmed bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsManagement bookings={bookings} onUpdate={loadBookings} />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView bookings={bookings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
