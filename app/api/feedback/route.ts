import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import User from "@/models/User";
import Notification from "@/models/Notification";

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

// GET /api/feedback - Get user's feedback or all feedback (admin)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    let feedback;
    if (isAdmin) {
      // TODO: Add admin authentication check
      feedback = await Feedback.find({})
        .populate("userId", "name email")
        .populate("bookingId", "serviceName date")
        .sort({ createdAt: -1 });
    } else {
      const user = await verifyToken(request);
      feedback = await Feedback.find({ userId: user._id })
        .populate("bookingId", "serviceName date")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get feedback error:", error);

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

// POST /api/feedback - Create new feedback
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await verifyToken(request);

    const {
      bookingId,
      rating,
      title,
      comment,
      serviceQuality,
      timeliness,
      value,
      wouldRecommend,
      isPublic,
    } = await request.json();

    // Validate required fields
    if (
      !rating ||
      !title ||
      !comment ||
      serviceQuality === undefined ||
      timeliness === undefined ||
      value === undefined ||
      wouldRecommend === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate ratings (1-5)
    if (
      rating < 1 ||
      rating > 5 ||
      serviceQuality < 1 ||
      serviceQuality > 5 ||
      timeliness < 1 ||
      timeliness > 5 ||
      value < 1 ||
      value > 5
    ) {
      return NextResponse.json(
        { success: false, message: "Ratings must be between 1 and 5" },
        { status: 400 }
      );
    }

    const feedback = new Feedback({
      userId: user._id,
      bookingId,
      rating: Number(rating),
      title,
      comment,
      serviceQuality: Number(serviceQuality),
      timeliness: Number(timeliness),
      value: Number(value),
      wouldRecommend: Boolean(wouldRecommend),
      isPublic: Boolean(isPublic),
      status: "pending", // Requires admin approval to be public
    });

    await feedback.save();

    // Create notification for admin
    const notification = new Notification({
      type: "feedback_received",
      title: "New Feedback Received",
      message: `${user.name} submitted feedback: "${title}"`,
      priority: "medium",
      relatedId: feedback._id,
      relatedModel: "Feedback",
      metadata: { rating, userName: user.name },
    });

    await notification.save();

    // Notify admin via WebSocket
    const wsManager = (global as { wsManager?: any }).wsManager;
    if (wsManager) {
      wsManager.notifyNewFeedback({
        id: feedback._id,
        userName: user.name,
        rating: feedback.rating,
        title: feedback.title,
        createdAt: feedback.createdAt,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);

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
