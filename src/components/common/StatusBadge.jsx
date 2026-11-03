export default function StatusBadge({ status, size = "md" }) {
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs font-semibold";

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    case "Available":
    case "Confirmed":
      // Green
      colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-200";
      break;
    case "Booked":
    case "Cancelled":
      // Red
      colorClasses = "bg-rose-50 text-rose-800 border-rose-200";
      break;
    case "Occupied":
    case "Limited":
      // Orange / Terracotta
      colorClasses = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "Unavailable":
    case "Full":
    case "Completed":
      // Grey
      colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
      break;
    default:
      colorClasses = "bg-[#DCE5DC] text-[#263653] border-[#B8CBB8]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Available" || status === "Confirmed"
            ? "bg-emerald-600"
            : status === "Booked" || status === "Cancelled"
            ? "bg-rose-600"
            : status === "Occupied" || status === "Limited"
            ? "bg-amber-600"
            : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}
