"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";

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
}

interface CalendarViewProps {
  bookings: BookingData[];
}

export function CalendarView({ bookings }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const bookingsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return bookings.filter(
      (booking) =>
        booking.date && isSameDay(new Date(booking.date), selectedDate)
    );
  }, [bookings, selectedDate]);

  const datesWithBookings = useMemo(() => {
    return bookings.filter((b) => b.date).map((b) => new Date(b.date));
  }, [bookings]);

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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
          <CardDescription>View bookings by date</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              booked: datesWithBookings,
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                textDecoration: "underline",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Select a date"}
          </CardTitle>
          <CardDescription>
            {bookingsOnSelectedDate.length} booking
            {bookingsOnSelectedDate.length !== 1 ? "s" : ""} on this date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookingsOnSelectedDate.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No bookings scheduled for this date
            </div>
          ) : (
            <div className="space-y-4">
              {bookingsOnSelectedDate.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{booking.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Guests:</span>{" "}
                      {booking.guests}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {booking.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {booking.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
