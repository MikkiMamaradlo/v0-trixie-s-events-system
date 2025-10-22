import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await verifyToken(request);

    // Get user's bookings
    const bookings = await Booking.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    if (
      error.message === "No token provided" ||
      error.message === "User not found"
    ) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await verifyToken(request);

    const {
      serviceId,
      serviceName,
      serviceCategory,
      customerName,
      email,
      phone,
      date,
      guests,
      specialRequests,
      totalPrice,
    } = await request.json();

    // Validate required fields
    if (
      !serviceId ||
      !serviceName ||
      !serviceCategory ||
      !customerName ||
      !email ||
      !phone ||
      !date ||
      !guests ||
      totalPrice === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Validate guests and price
    if (guests < 1 || guests > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Number of guests must be between 1 and 1000",
        },
        { status: 400 }
      );
    }

    if (totalPrice < 0) {
      return NextResponse.json(
        { success: false, message: "Total price cannot be negative" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = new Booking({
      serviceId: Number(serviceId),
      serviceName,
      serviceCategory,
      customerName,
      email,
      phone,
      date: bookingDate,
      guests: Number(guests),
      specialRequests,
      totalPrice: Number(totalPrice),
      userId: user._id,
      status: "pending",
    });

    await booking.save();

    // Notify admin via WebSocket
    const wsManager = (global as { wsManager?: any }).wsManager;
    if (wsManager) {
      wsManager.notifyNewBooking({
        id: booking._id,
        serviceName: booking.serviceName,
        customerName: booking.customerName,
        email: booking.email,
        date: booking.date,
        status: booking.status,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    if (
      error.message === "No token provided" ||
      error.message === "User not found"
    ) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
