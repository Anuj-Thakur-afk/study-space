import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

export default function SpaceCard({ space }) {
  // Appropriate academic icon per study type
  const getIcon = (type) => {
    switch (type) {
      case "Silent Study":
        return "📚";
      case "Group Study":
        return "👥";
      case "Discussion Room":
        return "💬";
      case "Individual Study":
      default:
        return "🪑";
    }
  };

  const percentAvailable =
    space.totalSeats > 0 ? Math.round((space.availableSeats / space.totalSeats) * 100) : 0;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#E69A68] hover:shadow-md">
      {/* Header with Type Icon & Availability Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#DCE5DC] text-2xl">
          <span>{getIcon(space.studyType)}</span>
        </div>
        <StatusBadge status={space.availability} />
      </div>

      {/* Study Type Category */}
      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#E69A68]">
        {space.studyType}
      </p>

      {/* Space Name */}
      <h3 className="mt-1 text-lg font-bold text-[#263653] leading-snug group-hover:text-[#E69A68] transition">
        {space.name}
      </h3>

      {/* Location Details */}
      <p className="mt-1 text-xs text-[#777777]">
        {space.buildingName || space.building} · {space.floor} · <span className="font-medium text-[#263653]">{space.zone || space.location}</span>
      </p>

      {/* Capacity & Progress */}
      <div className="mt-4 rounded-xl bg-[#F5F2EA] p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#777777]">Seat Availability</span>
          <span className="font-bold text-[#263653]">
            {space.availableSeats} <span className="font-normal text-[#777777]">/ {space.totalSeats} seats</span>
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percentAvailable > 40
                ? "bg-emerald-600"
                : percentAvailable > 15
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
            style={{ width: `${percentAvailable}%` }}
          />
        </div>
      </div>

      {/* Facilities Pills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {space.facilities &&
          space.facilities.slice(0, 3).map((facility) => (
            <span
              key={facility}
              className="rounded-md border border-slate-100 bg-[#F5F2EA]/60 px-2 py-0.5 text-[11px] text-[#263238]"
            >
              ✓ {facility}
            </span>
          ))}
        {space.facilities && space.facilities.length > 3 && (
          <span className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-[#777777]">
            +{space.facilities.length - 3} more
          </span>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-auto pt-5">
        <Link
          href={`/spaces/${space.id || space._id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#263653] bg-white py-2.5 text-xs font-bold text-[#263653] transition group-hover:bg-[#263653] group-hover:text-white"
        >
          <span>View Space & Reserve</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
