import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Notification from "@/models/Notification";
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

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const unreadOnly = searchParams.get("unread") === "true";

    let query: any = {};

    if (isAdmin) {
      // TODO: Add admin authentication check
      query.userId = null; // Admin notifications
    } else {
      const user = await verifyToken(request);
      query.userId = user._id;
    }

    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent too many results

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

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

// POST /api/notifications - Create notification (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const {
      userId,
      type,
      title,
      message,
      priority,
      relatedId,
      relatedModel,
      metadata,
      expiresAt,
    } = await request.json();

    // Validate required fields
    if (!type || !title || !message || !priority) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields: type, title, message, priority",
        },
        { status: 400 }
      );
    }

    // Validate type and priority
    const validTypes = [
      "booking_created",
      "booking_confirmed",
      "booking_cancelled",
      "payment_received",
      "feedback_received",
      "system_alert",
    ];
    const validPriorities = ["low", "medium", "high", "urgent"];

    if (!validTypes.includes(type) || !validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, message: "Invalid type or priority" },
        { status: 400 }
      );
    }

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      priority,
      relatedId,
      relatedModel,
      metadata,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    await notification.save();

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/mark-read - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { success: false, message: "notificationIds array is required" },
        { status: 400 }
      );
    }

    const user = await verifyToken(request);

    // Update notifications for this user
    await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: user._id },
      { isRead: true }
    );

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("Mark notifications read error:", error);

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
