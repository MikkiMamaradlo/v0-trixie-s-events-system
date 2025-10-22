import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
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

// GET /api/inventory - Get all inventory items
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Allow both authenticated users and admins to view inventory
    // (You might want to restrict this based on your business logic)

    const inventory = await Inventory.find({}).sort({ category: 1, name: 1 });

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Create new inventory item (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    await verifyAdminToken(request);

    const {
      name,
      category,
      description,
      quantity,
      available,
      price,
      condition,
      lastMaintenance,
      location,
      notes,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !category ||
      quantity === undefined ||
      available === undefined ||
      price === undefined ||
      !condition
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Required fields: name, category, quantity, available, price, condition",
        },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["party-planning", "equipment-rental", "catering"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate condition
    const validConditions = ["excellent", "good", "fair", "poor"];
    if (!validConditions.includes(condition)) {
      return NextResponse.json(
        { success: false, message: "Invalid condition" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (quantity < 0 || available < 0 || available > quantity || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quantity, available, or price values",
        },
        { status: 400 }
      );
    }

    // Create inventory item
    const inventoryItem = new Inventory({
      name,
      category,
      description,
      quantity: Number(quantity),
      available: Number(available),
      price: Number(price),
      condition,
      lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : undefined,
      location,
      notes,
    });

    await inventoryItem.save();

    return NextResponse.json({
      success: true,
      message: "Inventory item created successfully",
      inventory: inventoryItem,
    });
  } catch (error: any) {
    console.error("Create inventory error:", error);

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
