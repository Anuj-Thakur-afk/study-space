import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Campus Administration | StudySpace",
  description: "Manage university study spaces, seats, bookings, and physical occupancy.",
};

export default function AdminLayout({ children }) {
  const session = getSessionUser();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
