import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Seat from "@/models/Seat";
import StudySpace from "@/models/StudySpace";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin required" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { studySpaceId, seatNumber, features, status, row, col } = body;

    if (!studySpaceId || !seatNumber) {
      return NextResponse.json({ error: "Study space ID and seat number are required" }, { status: 400 });
    }

    const existingSeat = await Seat.findOne({ studySpaceId, seatNumber: seatNumber.trim() });
    if (existingSeat) {
      return NextResponse.json({ error: "Seat with this number already exists in this space" }, { status: 409 });
    }

    const newSeat = await Seat.create({
      studySpaceId,
      seatNumber: seatNumber.trim().toUpperCase(),
      features: Array.isArray(features) ? features : [],
      status: status || "Available",
      row: Number(row) || 1,
      col: Number(col) || 1,
    });

    // Update total seats count in StudySpace
    await StudySpace.findByIdAndUpdate(studySpaceId, { $inc: { totalSeats: 1 } });

    return NextResponse.json(
      { message: "Seat created successfully", seat: { ...newSeat.toObject(), id: newSeat._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create seat error:", error);
    return NextResponse.json({ error: "Failed to create seat" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin required" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { seatId, status, features } = body;

    if (!seatId) {
      return NextResponse.json({ error: "Seat ID is required" }, { status: 400 });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (Array.isArray(features)) updateFields.features = features;

    const updatedSeat = await Seat.findByIdAndUpdate(seatId, updateFields, { new: true });
    if (!updatedSeat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Seat updated successfully",
      seat: { ...updatedSeat.toObject(), id: updatedSeat._id.toString() },
    });
  } catch (error) {
    console.error("Update seat error:", error);
    return NextResponse.json({ error: "Failed to update seat" }, { status: 500 });
  }
}
