import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to verify JWT token and check admin role
async function verifyAdminToken(request: NextRequest) {
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

  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}

// GET /api/payments - Get all payments (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    await verifyAdminToken(request);

    // Get all payments with booking information
    const payments = await Payment.find({})
      .populate("bookingId", "serviceName customerName totalPrice status")
      .sort({ paymentDate: -1 });

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error: any) {
    console.error("Get payments error:", error);

    if (
      error.message === "No token provided" ||
      error.message === "User not found" ||
      error.message === "Admin access required"
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

// POST /api/payments - Create payment record
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await verifyAdminToken(request); // Only admins can create payments for now

    const { bookingId, amount, paymentMethod, transactionId, notes } =
      await request.json();

    // Validate required fields
    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields: bookingId, amount, paymentMethod",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = [
      "credit_card",
      "debit_card",
      "bank_transfer",
      "cash",
      "paypal",
    ];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = new Payment({
      bookingId,
      amount: Number(amount),
      paymentMethod,
      transactionId,
      notes,
      status: "completed", // Default to completed for demo
    });

    await payment.save();

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error: any) {
    console.error("Create payment error:", error);

    if (
      error.message === "No token provided" ||
      error.message === "User not found" ||
      error.message === "Admin access required"
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
