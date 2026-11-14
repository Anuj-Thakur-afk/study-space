export default function AdminStats({ stats }) {
  const cards = [
    {
      label: "Total Spaces",
      value: stats.totalSpaces || 0,
      subtext: `${stats.totalRooms || 0} group rooms`,
      code: "SP",
      accent: false,
    },
    {
      label: "Total Seats",
      value: stats.totalSeats || 0,
      subtext: "Across campus",
      code: "ST",
      accent: false,
    },
    {
      label: "Available Seats",
      value: stats.availableSeats || 0,
      subtext: "Ready for walk-in",
      code: "AV",
      accent: false,
      color: "text-[#477A55]",
    },
    {
      label: "Reserved Seats",
      value: stats.bookedSeats || 0,
      subtext: "Active bookings",
      code: "RS",
      accent: false,
      color: "text-[#C43C32]",
    },
    {
      label: "Occupied Seats",
      value: stats.occupiedSeats || 0,
      subtext: "Verified on campus",
      code: "OC",
      accent: true,
      color: "text-[#F15A24]",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings || 0,
      subtext: "Recorded in system",
      code: "BK",
      accent: false,
    },
  ];

  return (
    <div className="grid gap-px border border-[#BDBDBD] bg-[#BDBDBD] sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-5 transition duration-150 hover:bg-[#F4F3ED]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-[#777777] uppercase tracking-widest">
              {card.label}
            </span>
            <span className="border border-[#BDBDBD] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#777777]">
              {card.code}
            </span>
          </div>
          <div
            className={`mt-2 text-3xl font-black tracking-tight ${
              card.color || (card.accent ? "text-[#F15A24]" : "text-[#171717]")
            }`}
          >
            {card.value}
          </div>
          <p className="mt-1 text-[10px] text-[#777777] uppercase tracking-wider">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
