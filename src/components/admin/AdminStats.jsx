export default function AdminStats({ stats }) {
  const cards = [
    {
      label: "Total Study Spaces",
      value: stats.totalSpaces || 0,
      subtext: `${stats.totalRooms || 0} group rooms included`,
      icon: "🏛️",
      bgColor: "bg-[#F5F2EA]",
      textColor: "text-[#263653]",
    },
    {
      label: "Total Campus Seats",
      value: stats.totalSeats || 0,
      subtext: "Across all buildings",
      icon: "🪑",
      bgColor: "bg-[#DCE5DC]",
      textColor: "text-[#263653]",
    },
    {
      label: "Available Seats",
      value: stats.availableSeats || 0,
      subtext: "Ready for walk-in or booking",
      icon: "🟢",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-800",
    },
    {
      label: "Reserved Seats",
      value: stats.bookedSeats || 0,
      subtext: "Confirmed student reservations",
      icon: "🔴",
      bgColor: "bg-rose-50",
      textColor: "text-rose-800",
    },
    {
      label: "Physically Occupied",
      value: stats.occupiedSeats || 0,
      subtext: "Verified by campus desk",
      icon: "🟠",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
    },
    {
      label: "Total Reservations",
      value: stats.totalBookings || 0,
      subtext: "Recorded in database",
      icon: "📋",
      bgColor: "bg-[#F5F2EA]",
      textColor: "text-[#263653]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`grid h-9 w-9 place-items-center rounded-xl ${card.bgColor} text-base`}>
              {card.icon}
            </div>
          </div>
          <div className={`mt-3 text-3xl font-extrabold tracking-tight ${card.textColor}`}>
            {card.value}
          </div>
          <p className="mt-1 text-xs text-[#777777]">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
