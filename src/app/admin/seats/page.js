import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import SeatManagement from "@/components/admin/SeatManagement";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Seat Management | StudySpace Admin",
};

async function getSpacesForSeats() {
  await connectDB();
  const spaces = await StudySpace.find({ isActive: true }).sort({ name: 1 }).lean();
  return spaces.map((s) => ({
    ...s,
    id: s._id.toString(),
    _id: s._id.toString(),
  }));
}

export default async function AdminSeatsPage() {
  const spaces = await getSpacesForSeats();

  return <SeatManagement spaces={spaces} />;
}
