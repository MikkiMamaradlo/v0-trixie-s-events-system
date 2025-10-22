import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Package from "@/models/Package";
import Service from "@/models/Service";

// GET /api/packages/[id] - Get package by ID with populated services
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const packageDoc = await Package.findById(id).populate(
      "services",
      "name category price description"
    );

    if (!packageDoc) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      package: packageDoc,
    });
  } catch (error) {
    console.error("Get package error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/packages/[id] - Update package (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      isActive,
    } = await request.json();

    const { id } = await params;
    const packageDoc = await Package.findById(id);

    if (!packageDoc) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    // Validate services if provided
    if (services) {
      const serviceIds = services.map((id: string) => id);
      const existingServices = await Service.find({ _id: { $in: serviceIds } });

      if (existingServices.length !== serviceIds.length) {
        return NextResponse.json(
          { success: false, message: "One or more services not found" },
          { status: 400 }
        );
      }
      packageDoc.services = serviceIds;
    }

    // Update other fields if provided
    if (name !== undefined) packageDoc.name = name;
    if (description !== undefined) packageDoc.description = description;
    if (totalPrice !== undefined) packageDoc.totalPrice = Number(totalPrice);
    if (discountPercentage !== undefined)
      packageDoc.discountPercentage = Number(discountPercentage);
    if (estimatedDuration !== undefined)
      packageDoc.estimatedDuration = Number(estimatedDuration);
    if (maxGuests !== undefined) packageDoc.maxGuests = Number(maxGuests);
    if (imageUrl !== undefined) packageDoc.imageUrl = imageUrl;
    if (isActive !== undefined) packageDoc.isActive = isActive;

    await packageDoc.save();
    await packageDoc.populate("services", "name category price");

    return NextResponse.json({
      success: true,
      message: "Package updated successfully",
      package: packageDoc,
    });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/packages/[id] - Delete package (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const { id } = await params;
    const packageDoc = await Package.findById(id);

    if (!packageDoc) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    await Package.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Delete package error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
