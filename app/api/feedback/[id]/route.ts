import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
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

// GET /api/feedback/[id] - Get feedback by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const feedback = await Feedback.findById(id)
      .populate("userId", "name email")
      .populate("bookingId", "serviceName date");

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/feedback/[id] - Update feedback (admin only for moderation)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check for moderation
    const { status, adminResponse, isPublic } = await request.json();

    const { id } = await params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    // Update moderation fields
    if (status !== undefined) feedback.status = status;
    if (adminResponse !== undefined) {
      feedback.adminResponse = adminResponse;
      feedback.adminResponseDate = new Date();
    }
    if (isPublic !== undefined) feedback.isPublic = isPublic;

    await feedback.save();
    await feedback.populate("userId", "name email");
    await feedback.populate("bookingId", "serviceName date");

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    console.error("Update feedback error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback/[id] - Delete feedback (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const { id } = await params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    await Feedback.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
