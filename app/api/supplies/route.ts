import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Supply from "@/models/Supply";

// GET /api/supplies - Get all active supplies
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const supplies = await Supply.find({ isActive: true }).sort({
      category: 1,
      name: 1,
    });

    return NextResponse.json({
      success: true,
      supplies,
    });
  } catch (error) {
    console.error("Get supplies error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/supplies - Create new supply (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const {
      name,
      description,
      category,
      quantity,
      available,
      unitPrice,
      rentalPrice,
      imageUrl,
      condition,
      location,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      quantity === undefined ||
      available === undefined ||
      unitPrice === undefined ||
      rentalPrice === undefined ||
      !location
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      "Tables & Chairs",
      "Decorations",
      "Sound Equipment",
      "Lighting",
      "Catering Equipment",
      "Linens",
      "Other",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate condition
    const validConditions = ["new", "good", "fair", "poor"];
    if (condition && !validConditions.includes(condition)) {
      return NextResponse.json(
        { success: false, message: "Invalid condition" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (
      quantity < 0 ||
      available < 0 ||
      available > quantity ||
      unitPrice < 0 ||
      rentalPrice < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid numeric values" },
        { status: 400 }
      );
    }

    const supply = new Supply({
      name,
      description,
      category,
      quantity: Number(quantity),
      available: Number(available),
      unitPrice: Number(unitPrice),
      rentalPrice: Number(rentalPrice),
      imageUrl,
      condition: condition || "good",
      location,
    });

    await supply.save();

    return NextResponse.json({
      success: true,
      message: "Supply created successfully",
      supply,
    });
  } catch (error) {
    console.error("Create supply error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
