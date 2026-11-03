import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import { getSessionUser } from "@/lib/auth";
import { spaceSchema } from "@/lib/validation";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    let space = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      space = await StudySpace.findById(id).lean();
    }
    if (!space) {
      // Fallback search by name slug if previously requested
      space = await StudySpace.findOne({
        name: new RegExp(id.replace(/-/g, " "), "i"),
      }).lean();
    }

    if (!space) {
      return NextResponse.json({ error: "Study space not found" }, { status: 404 });
    }

    const availableSeatsCount = await Seat.countDocuments({
      studySpaceId: space._id,
      status: "Available",
    });

    let calculatedAvailability = "Available";
    if (availableSeatsCount === 0) {
      calculatedAvailability = "Full";
    } else if (availableSeatsCount <= Math.max(1, Math.floor((space.totalSeats || 1) * 0.25))) {
      calculatedAvailability = "Limited";
    }

    return NextResponse.json({
      space: {
        ...space,
        id: space._id.toString(),
        _id: space._id.toString(),
        availableSeats: availableSeatsCount,
        availability: calculatedAvailability,
      },
    });
  } catch (error) {
    console.error("Get space error:", error);
    return NextResponse.json({ error: "Failed to fetch space details" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin role required" }, { status: 403 });
    }

    await connectDB();
    const { id } = params;
    const body = await request.json();

    const validation = spaceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;
    const updatedSpace = await StudySpace.findByIdAndUpdate(
      id,
      {
        name: data.name,
        buildingName: data.buildingName,
        floor: data.floor,
        zone: data.zone,
        description: data.description,
        studyType: data.studyType,
        totalSeats: data.totalSeats,
        facilities: data.facilities,
        usageRules: data.usageRules,
        isActive: data.isActive,
      },
      { new: true }
    );

    if (!updatedSpace) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Space updated successfully",
      space: { ...updatedSpace.toObject(), id: updatedSpace._id.toString() },
    });
  } catch (error) {
    console.error("Update space error:", error);
    return NextResponse.json({ error: "Failed to update space" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin role required" }, { status: 403 });
    }

    await connectDB();
    const { id } = params;

    // Soft delete by setting isActive to false
    const space = await StudySpace.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Study space deactivated successfully" });
  } catch (error) {
    console.error("Delete space error:", error);
    return NextResponse.json({ error: "Failed to delete space" }, { status: 500 });
  }
}
