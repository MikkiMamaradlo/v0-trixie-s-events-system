import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Supply from "@/models/Supply";

// GET /api/supplies/[id] - Get supply by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const supply = await Supply.findById(id);

    if (!supply) {
      return NextResponse.json(
        { success: false, message: "Supply not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      supply,
    });
  } catch (error) {
    console.error("Get supply error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/supplies/[id] - Update supply (admin only)
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
      category,
      quantity,
      available,
      unitPrice,
      rentalPrice,
      imageUrl,
      condition,
      location,
      isActive,
    } = await request.json();

    const { id } = await params;
    const supply = await Supply.findById(id);

    if (!supply) {
      return NextResponse.json(
        { success: false, message: "Supply not found" },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (name !== undefined) supply.name = name;
    if (description !== undefined) supply.description = description;
    if (category !== undefined) supply.category = category;
    if (quantity !== undefined) supply.quantity = Number(quantity);
    if (available !== undefined) supply.available = Number(available);
    if (unitPrice !== undefined) supply.unitPrice = Number(unitPrice);
    if (rentalPrice !== undefined) supply.rentalPrice = Number(rentalPrice);
    if (imageUrl !== undefined) supply.imageUrl = imageUrl;
    if (condition !== undefined) supply.condition = condition;
    if (location !== undefined) supply.location = location;
    if (isActive !== undefined) supply.isActive = isActive;

    await supply.save();

    return NextResponse.json({
      success: true,
      message: "Supply updated successfully",
      supply,
    });
  } catch (error) {
    console.error("Update supply error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/supplies/[id] - Delete supply (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // TODO: Add admin authentication check
    const { id } = await params;
    const supply = await Supply.findById(id);

    if (!supply) {
      return NextResponse.json(
        { success: false, message: "Supply not found" },
        { status: 404 }
      );
    }

    await Supply.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Supply deleted successfully",
    });
  } catch (error) {
    console.error("Delete supply error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
