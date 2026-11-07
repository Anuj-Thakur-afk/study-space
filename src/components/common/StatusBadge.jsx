export default function StatusBadge({ status, size = "md" }) {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[10px]"
      : "px-2.5 py-1 text-xs";

  let colorClasses = "bg-[#F4F3ED] text-[#777777] border-[#BDBDBD]";
  let dotColor = "bg-[#BDBDBD]";

  switch (status) {
    case "Available":
    case "Confirmed":
      colorClasses = "bg-[#E8F2EC] text-[#477A55] border-[#477A55]/30";
      dotColor = "bg-[#477A55]";
      break;
    case "Booked":
    case "Cancelled":
      colorClasses = "bg-[#FAEAE9] text-[#C43C32] border-[#C43C32]/30";
      dotColor = "bg-[#C43C32]";
      break;
    case "Occupied":
    case "Limited":
      colorClasses = "bg-[#FFE1D5] text-[#F15A24] border-[#F15A24]/30";
      dotColor = "bg-[#F15A24]";
      break;
    case "Unavailable":
    case "Full":
    case "Completed":
      colorClasses = "bg-[#F4F3ED] text-[#777777] border-[#BDBDBD]";
      dotColor = "bg-[#BDBDBD]";
      break;
    default:
      colorClasses = "bg-[#F4F3ED] text-[#777777] border-[#BDBDBD]";
      dotColor = "bg-[#BDBDBD]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-semibold uppercase tracking-wider ${sizeClasses} ${colorClasses}`}
    >
      <span className={`h-1.5 w-1.5 ${dotColor}`} />
      {status}
    </span>
  );
}
