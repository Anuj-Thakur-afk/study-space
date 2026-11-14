import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import { getSessionUser } from "@/lib/auth";
import SpaceDetailsClient from "@/components/discovery/SpaceDetailsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  await connectDB();
  const { id } = params;

  let space = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    space = await StudySpace.findById(id).lean();
  }
  if (!space) {
    space = await StudySpace.findOne({
      name: new RegExp(id.replace(/-/g, " "), "i"),
    }).lean();
  }

  return {
    title: space ? `${space.name} | StudySpace` : "Space Not Found | StudySpace",
  };
}

export default async function SpaceDetailsPage({ params }) {
  await connectDB();
  const { id } = params;

  let space = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    space = await StudySpace.findById(id).lean();
  }
  if (!space) {
    space = await StudySpace.findOne({
      name: new RegExp(id.replace(/-/g, " "), "i"),
    }).lean();
  }

  if (!space) {
    notFound();
  }

  const seats = await Seat.find({ studySpaceId: space._id })
    .sort({ row: 1, col: 1, seatNumber: 1 })
    .lean();

  const availableSeatsCount = seats.filter((s) => s.status === "Available").length;

  let calculatedAvailability = "Available";
  if (availableSeatsCount === 0) calculatedAvailability = "Full";
  else if (availableSeatsCount <= Math.max(1, Math.floor((space.totalSeats || 1) * 0.25))) calculatedAvailability = "Limited";

  const enrichedSpace = {
    ...space,
    id: space._id.toString(),
    _id: space._id.toString(),
    availableSeats: availableSeatsCount,
    availability: calculatedAvailability,
  };

  const formattedSeats = seats.map((s) => ({
    ...s,
    id: s._id.toString(),
    _id: s._id.toString(),
  }));

  const user = getSessionUser();

  const plainSpace = JSON.parse(JSON.stringify(enrichedSpace));
  const plainSeats = JSON.parse(JSON.stringify(formattedSeats));

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <SpaceDetailsClient
        space={plainSpace}
        initialSeats={plainSeats}
        user={user}
      />
    </div>
  );
}
