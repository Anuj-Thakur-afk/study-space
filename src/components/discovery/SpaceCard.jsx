import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

// Map study type → short code for display
const TYPE_CODES = {
  "Silent Study": "SS",
  "Individual Study": "IS",
  "Group Study": "GS",
  "Discussion Room": "DR",
};

export default function SpaceCard({ space }) {
  const percentAvailable =
    space.totalSeats > 0
      ? Math.round((space.availableSeats / space.totalSeats) * 100)
      : 0;

  return (
    <article className="group flex flex-col bg-white border border-[#BDBDBD] hover:border-[#F15A24] transition duration-200">
      {/* Top bar — type code + availability */}
      <div className="flex items-center justify-between border-b border-[#BDBDBD] group-hover:border-[#F15A24]/30 px-5 py-3 transition">
        <span className="text-2xl font-black text-[#BDBDBD] group-hover:text-[#F15A24] transition leading-none">
          {TYPE_CODES[space.studyType] || "SP"}
        </span>
        <StatusBadge status={space.availability} size="sm" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Study type label */}
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
          {space.studyType}
        </span>

        {/* Space name */}
        <h3 className="mt-1 text-base font-black tracking-tight text-[#171717] leading-snug group-hover:text-[#F15A24] transition">
          {space.name}
        </h3>

        {/* Location */}
        <p className="mt-1.5 text-xs text-[#777777]">
          {space.buildingName || space.building} · {space.floor} ·{" "}
          <span className="font-semibold text-[#171717]">
            {space.zone || space.location}
          </span>
        </p>

        {/* Capacity bar */}
        <div className="mt-4 border border-[#F4F3ED] bg-[#F4F3ED] p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[9px] uppercase tracking-widest text-[#777777]">
              Availability
            </span>
            <span className="font-black text-[#171717] text-xs">
              {space.availableSeats}
              <span className="font-normal text-[#777777]">
                /{space.totalSeats} seats
              </span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#BDBDBD]/30">
            <div
              className={`h-full transition-all ${
                percentAvailable > 40
                  ? "bg-[#477A55]"
                  : percentAvailable > 15
                  ? "bg-[#F15A24]"
                  : "bg-[#C43C32]"
              }`}
              style={{ width: `${percentAvailable}%` }}
            />
          </div>
        </div>

        {/* Facilities */}
        {space.facilities && space.facilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {space.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="border border-[#BDBDBD] px-2 py-0.5 text-[10px] font-medium text-[#777777] uppercase tracking-wide"
              >
                {facility}
              </span>
            ))}
            {space.facilities.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-[#777777]">
                +{space.facilities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-5">
          <Link
            href={`/spaces/${space.id || space._id}`}
            className="flex w-full items-center justify-between border border-[#171717] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171717] transition group-hover:bg-[#171717] group-hover:text-white"
          >
            <span>View & Reserve</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
