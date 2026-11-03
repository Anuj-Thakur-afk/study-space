import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import SpaceManagement from "@/components/admin/SpaceManagement";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Study Spaces | StudySpace Admin",
};

async function getAdminSpaces() {
  await connectDB();
  const spaces = await StudySpace.find().sort({ createdAt: -1 }).lean();
  return spaces.map((s) => ({
    ...s,
    id: s._id.toString(),
    _id: s._id.toString(),
  }));
}

export default async function AdminSpacesPage() {
  const spaces = await getAdminSpaces();

  return <SpaceManagement initialSpaces={spaces} />;
}
