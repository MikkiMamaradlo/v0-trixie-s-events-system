import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { password } = await request.json();

    // Validate input
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    // For demo purposes, check against hardcoded admin password
    // In production, you should have an admin user in the database
    if (password !== "admin123") {
      return NextResponse.json(
        { success: false, message: "Invalid admin password" },
        { status: 401 }
      );
    }

    // Try to find existing admin user, or create one
    let adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      // Create default admin user if it doesn't exist
      adminUser = new User({
        name: "System Administrator",
        email: "admin@trixtech.com",
        password: "admin123", // This will be hashed by the pre-save hook
        role: "admin",
      });
      await adminUser.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return admin user data and token
    const userResponse = {
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      phone: adminUser.phone,
      createdAt: adminUser.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: "Admin login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
