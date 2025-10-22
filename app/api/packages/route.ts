import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Package from "@/models/Package";
import Service from "@/models/Service";

// GET /api/packages - Get all active packages with populated services
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const packages = await Package.find({ isActive: true })
      .populate("services", "name category price")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error("Get packages error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/packages - Create new package (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const {
      name,
      description,
      services,
      totalPrice,
      discountPercentage,
      estimatedDuration,
      maxGuests,
      imageUrl,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !description ||
      !services ||
      !totalPrice ||
      estimatedDuration === undefined ||
      !maxGuests
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate services exist
    const serviceIds = services.map((id: string) => id);
    const existingServices = await Service.find({ _id: { $in: serviceIds } });

    if (existingServices.length !== serviceIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more services not found" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (totalPrice < 0 || estimatedDuration < 1 || maxGuests < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid numeric values" },
        { status: 400 }
      );
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Discount percentage must be between 0 and 100",
        },
        { status: 400 }
      );
    }

    const packageDoc = new Package({
      name,
      description,
      services: serviceIds,
      totalPrice: Number(totalPrice),
      discountPercentage: Number(discountPercentage),
      estimatedDuration: Number(estimatedDuration),
      maxGuests: Number(maxGuests),
      imageUrl,
    });

    await packageDoc.save();

    // Populate services before returning
    await packageDoc.populate("services", "name category price");

    return NextResponse.json({
      success: true,
      message: "Package created successfully",
      package: packageDoc,
    });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
