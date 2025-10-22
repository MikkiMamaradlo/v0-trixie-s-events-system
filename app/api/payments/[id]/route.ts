conimport { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Payment from "@/models/Payment";
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

// PUT /api/payments/[id] - Update payment status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    await verifyAdminToken(request);

    const { status } = await request.json();

    // Validate status
    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Find and update payment
    const { id } = await params;
    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment updated successfully",
      payment,
    });
  } catch (error: any) {
    console.error("Update payment error:", error);

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
