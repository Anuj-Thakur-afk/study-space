import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import Building from "@/models/Building";
import { getSessionUser } from "@/lib/auth";
import { spaceSchema } from "@/lib/validation";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "All types";
    const building = searchParams.get("building") || "All locations";
    const availability = searchParams.get("availability") || "Any availability";

    const query = { isActive: true };

    if (type && type !== "All types") {
      query.studyType = type;
    }

    if (building && building !== "All locations") {
      query.buildingName = building;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { buildingName: regex },
        { floor: regex },
        { zone: regex },
        { studyType: regex },
      ];
    }

    const spaces = await StudySpace.find(query).sort({ createdAt: -1 }).lean();

    // Compute live availability by querying seats
    const spacesWithLiveStats = await Promise.all(
      spaces.map(async (space) => {
        const totalSeats = space.totalSeats || 0;
        const availableSeatsCount = await Seat.countDocuments({
          studySpaceId: space._id,
          status: "Available",
        });

        let calculatedAvailability = "Available";
        if (availableSeatsCount === 0) {
          calculatedAvailability = "Full";
        } else if (availableSeatsCount <= Math.max(1, Math.floor(totalSeats * 0.25))) {
          calculatedAvailability = "Limited";
        }

        return {
          ...space,
          id: space._id.toString(),
          _id: space._id.toString(),
          availableSeats: availableSeatsCount,
          totalSeats: totalSeats,
          availability: calculatedAvailability,
        };
      })
    );

    // Filter by availability if requested
    let result = spacesWithLiveStats;
    if (availability && availability !== "Any availability") {
      result = spacesWithLiveStats.filter(
        (space) => space.availability.toLowerCase() === availability.toLowerCase()
      );
    }

    return NextResponse.json({ spaces: result });
  } catch (error) {
    console.error("Fetch spaces error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study spaces" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin role required" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const validation = spaceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Find or create building reference if needed
    let building = await Building.findOne({ name: data.buildingName });
    if (!building) {
      building = await Building.create({
        name: data.buildingName,
        location: `${data.zone}, ${data.floor}`,
        description: `Academic campus facility: ${data.buildingName}`,
      });
    }

    const newSpace = await StudySpace.create({
      name: data.name,
      buildingId: building._id,
      buildingName: data.buildingName,
      floor: data.floor,
      zone: data.zone,
      description: data.description,
      studyType: data.studyType,
      totalSeats: data.totalSeats,
      facilities: data.facilities || [],
      usageRules: data.usageRules || [],
      isActive: data.isActive ?? true,
    });

    // Auto-generate seats for the space
    const seatsToInsert = [];
    const cols = data.totalSeats <= 8 ? 4 : data.totalSeats <= 16 ? 4 : 6;
    for (let i = 1; i <= data.totalSeats; i++) {
      const seatNum = `${data.name.slice(0, 2).toUpperCase()}-${String(i).padStart(2, "0")}`;
      const row = Math.ceil(i / cols);
      const col = ((i - 1) % cols) + 1;
      const features = [];
      if (i % 2 === 1) features.push("Power Socket");
      if (i % 3 === 0) features.push("Window View");
      if (i % 4 === 0) features.push("Desk Lamp");
      if (features.length === 0) features.push("Standard Desk");

      seatsToInsert.push({
        seatNumber: seatNum,
        studySpaceId: newSpace._id,
        status: "Available",
        features,
        row,
        col,
      });
    }

    await Seat.insertMany(seatsToInsert);

    return NextResponse.json(
      {
        message: "Study space created successfully",
        space: { ...newSpace.toObject(), id: newSpace._id.toString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create space error:", error);
    return NextResponse.json({ error: "Failed to create study space" }, { status: 500 });
  }
}
