import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Service from "@/models/Service";

// GET /api/services - Get all active services
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const services = await Service.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/services - Create new service (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const {
      name,
      description,
      category,
      price,
      duration,
      maxGuests,
      includes,
      imageUrl,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      !duration ||
      !maxGuests
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      "Party Planning",
      "Equipment Rental",
      "Catering",
      "Photography",
      "Entertainment",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (price < 0 || duration < 1 || maxGuests < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid numeric values" },
        { status: 400 }
      );
    }

    const service = new Service({
      name,
      description,
      category,
      price: Number(price),
      duration: Number(duration),
      maxGuests: Number(maxGuests),
      includes: includes || [],
      imageUrl,
    });

    await service.save();

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
