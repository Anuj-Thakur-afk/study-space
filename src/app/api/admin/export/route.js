import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "bookings";

    if (type === "bookings") {
      const bookings = await Booking.find()
        .populate("studySpaceId", "name buildingName floor zone studyType")
        .populate("seatId", "seatNumber")
        .populate("userId", "name email")
        .sort({ bookingDate: -1, startTime: -1 })
        .lean();

      const headers = [
        "Booking ID",
        "Student Name",
        "Student Email",
        "Space Name",
        "Building",
        "Floor",
        "Zone",
        "Type",
        "Seat Number",
        "Date",
        "Start Time",
        "End Time",
        "Status",
        "Purpose",
      ];

      const rows = bookings.map((b) => [
        `"${b._id.toString()}"`,
        `"${(b.userId?.name || "").replace(/"/g, '""')}"`,
        `"${(b.userId?.email || "").replace(/"/g, '""')}"`,
        `"${(b.studySpaceId?.name || "").replace(/"/g, '""')}"`,
        `"${(b.studySpaceId?.buildingName || "").replace(/"/g, '""')}"`,
        `"${b.studySpaceId?.floor || ""}"`,
        `"${b.studySpaceId?.zone || ""}"`,
        `"${b.bookingType || "SEAT"}"`,
        `"${b.seatId?.seatNumber || "Entire Room"}"`,
        `"${b.bookingDate || ""}"`,
        `"${b.startTime || ""}"`,
        `"${b.endTime || ""}"`,
        `"${b.status || ""}"`,
        `"${(b.purpose || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="studyspace_bookings_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    if (type === "spaces") {
      const spaces = await StudySpace.find().sort({ name: 1 }).lean();
      const headers = ["Space ID", "Name", "Building", "Floor", "Zone", "Study Type", "Total Seats", "Active"];
      const rows = spaces.map((s) => [
        `"${s._id.toString()}"`,
        `"${(s.name || "").replace(/"/g, '""')}"`,
        `"${(s.buildingName || "").replace(/"/g, '""')}"`,
        `"${s.floor || ""}"`,
        `"${s.zone || ""}"`,
        `"${s.studyType || ""}"`,
        s.totalSeats || 0,
        s.isActive ? "Yes" : "No",
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="studyspace_spaces_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error) {
    console.error("CSV Export error:", error);
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}
