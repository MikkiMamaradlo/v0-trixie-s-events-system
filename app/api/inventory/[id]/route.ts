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

// PUT /api/inventory/[id] - Update inventory item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Validate category if provided
    if (category) {
      const validCategories = [
        "party-planning",
        "equipment-rental",
        "catering",
      ];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { success: false, message: "Invalid category" },
          { status: 400 }
        );
      }
    }

    // Validate condition if provided
    if (condition) {
      const validConditions = ["excellent", "good", "fair", "poor"];
      if (!validConditions.includes(condition)) {
        return NextResponse.json(
          { success: false, message: "Invalid condition" },
          { status: 400 }
        );
      }
    }

    // Prepare update object
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (quantity !== undefined) updateData.quantity = Number(quantity);
    if (available !== undefined) updateData.available = Number(available);
    if (price !== undefined) updateData.price = Number(price);
    if (condition !== undefined) updateData.condition = condition;
    if (lastMaintenance !== undefined)
      updateData.lastMaintenance = lastMaintenance
        ? new Date(lastMaintenance)
        : null;
    if (location !== undefined) updateData.location = location;
    if (notes !== undefined) updateData.notes = notes;

    // Validate numeric fields if provided
    const quantityNum = updateData.quantity as number;
    const availableNum = updateData.available as number;
    const priceNum = updateData.price as number;
    if (
      quantityNum < 0 ||
      availableNum < 0 ||
      availableNum > quantityNum ||
      priceNum < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quantity, available, or price values",
        },
        { status: 400 }
      );
    }

    // Find and update inventory item
    const { id } = await params;
    const inventoryItem = await Inventory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!inventoryItem) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inventory item updated successfully",
      inventory: inventoryItem,
    });
  } catch (error: any) {
    console.error("Update inventory error:", error);

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

// DELETE /api/inventory/[id] - Delete inventory item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    await verifyAdminToken(request);

    // Find and delete inventory item
    const { id } = await params;
    const inventoryItem = await Inventory.findByIdAndDelete(id);

    if (!inventoryItem) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete inventory error:", error);

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
