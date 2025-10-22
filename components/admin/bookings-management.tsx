"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Mail, Phone, Users, Eye } from "lucide-react";
import { format } from "date-fns";

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

interface BookingsManagementProps {
  bookings: BookingData[];
  onUpdate: () => void;
}

export function BookingsManagement({
  bookings,
  onUpdate,
}: BookingsManagementProps) {
  const { token } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => {
    try {
      if (!token) return;

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        console.error("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>
              View and manage all customer bookings
            </CardDescription>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No bookings found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.service}</h3>
                    <p className="text-sm text-muted-foreground">
                      Booked by {booking.name}
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
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.date
                        ? format(new Date(booking.date), "PPP")
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{booking.service}</DialogTitle>
                        <DialogDescription>
                          Booking details and notes
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Customer Information
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Event Details
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date:{" "}
                            {booking.date
                              ? format(new Date(booking.date), "PPP")
                              : "Not set"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Guests: {booking.guests}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Amount: ₱
                            {booking.totalAmount?.toLocaleString() || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Payment Status: {booking.paymentStatus || "pending"}
                          </p>
                        </div>
                        {booking.notes && (
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Additional Notes
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateBookingStatus(booking.id, "confirmed")
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateBookingStatus(booking.id, "cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateBookingStatus(booking.id, "cancelled")
                      }
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
