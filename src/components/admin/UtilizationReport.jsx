export default function UtilizationReport({ reportData }) {
  const { buildingStats = [], mostUsedSpaces = [], leastUsedSpaces = [], peakTimeDistribution = [], stats = {} } =
    reportData || {};

  const totalSeats = stats.totalSeats || 1;
  const availablePct = Math.round(((stats.availableSeats || 0) / totalSeats) * 100);
  const bookedPct = Math.round(((stats.bookedSeats || 0) / totalSeats) * 100);
  const occupiedPct = Math.round(((stats.occupiedSeats || 0) / totalSeats) * 100);
  const unavailablePct = Math.round(((stats.unavailableSeats || 0) / totalSeats) * 100);

  return (
    <div className="space-y-8">
      {/* Overview Header & Exports */}
      <div className="border border-[#BDBDBD] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#BDBDBD] pb-4">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
              Usage Reports
            </span>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#171717]">
              Space Usage & Occupancy
            </h2>
            <p className="text-xs text-[#777777] mt-0.5">
              Live breakdown of seats currently available, booked, occupied, or unavailable.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/export?type=bookings"
              download
              className="border border-[#171717] bg-[#171717] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F15A24] hover:border-[#F15A24] transition"
            >
              Export Bookings CSV
            </a>
            <a
              href="/api/admin/export?type=spaces"
              download
              className="border border-[#BDBDBD] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717] hover:border-[#171717] transition"
            >
              Export Spaces CSV
            </a>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-6 h-3 w-full border border-[#BDBDBD] bg-[#F4F3ED] flex">
          <div
            title={`Available: ${availablePct}%`}
            className="bg-[#477A55] h-full transition-all"
            style={{ width: `${availablePct}%` }}
          />
          <div
            title={`Booked: ${bookedPct}%`}
            className="bg-[#C43C32] h-full transition-all"
            style={{ width: `${bookedPct}%` }}
          />
          <div
            title={`Occupied: ${occupiedPct}%`}
            className="bg-[#F15A24] h-full transition-all"
            style={{ width: `${occupiedPct}%` }}
          />
          <div
            title={`Unavailable: ${unavailablePct}%`}
            className="bg-[#BDBDBD] h-full transition-all"
            style={{ width: `${unavailablePct}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="border border-[#477A55]/30 bg-[#E8F2EC] p-3">
            <span className="text-[#477A55] font-black uppercase tracking-wider text-[9px] block">Available</span>
            <span className="text-xl font-black text-[#171717]">{stats.availableSeats || 0}</span>
            <span className="text-[10px] text-[#477A55] font-bold ml-1">({availablePct}%)</span>
          </div>
          <div className="border border-[#C43C32]/30 bg-[#FAEAE9] p-3">
            <span className="text-[#C43C32] font-black uppercase tracking-wider text-[9px] block">Booked</span>
            <span className="text-xl font-black text-[#171717]">{stats.bookedSeats || 0}</span>
            <span className="text-[10px] text-[#C43C32] font-bold ml-1">({bookedPct}%)</span>
          </div>
          <div className="border border-[#F15A24]/30 bg-[#FFE1D5] p-3">
            <span className="text-[#F15A24] font-black uppercase tracking-wider text-[9px] block">Occupied</span>
            <span className="text-xl font-black text-[#171717]">{stats.occupiedSeats || 0}</span>
            <span className="text-[10px] text-[#F15A24] font-bold ml-1">({occupiedPct}%)</span>
          </div>
          <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-3">
            <span className="text-[#777777] font-black uppercase tracking-wider text-[9px] block">Unavailable</span>
            <span className="text-xl font-black text-[#171717]">{stats.unavailableSeats || 0}</span>
            <span className="text-[10px] text-[#777777] font-bold ml-1">({unavailablePct}%)</span>
          </div>
        </div>
      </div>

      {/* Most-Used & Least-Used Spaces */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Most Used */}
        <div className="border border-[#BDBDBD] bg-white p-5">
          <div className="border-b border-[#BDBDBD] pb-3 mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#F15A24]">
              High Demand
            </span>
            <h4 className="text-sm font-black uppercase tracking-tight text-[#171717]">
              Most-Utilized Spaces
            </h4>
          </div>
          <div className="space-y-2">
            {mostUsedSpaces.map((sp, idx) => (
              <div
                key={sp.id}
                className="flex items-center justify-between border border-[#BDBDBD] bg-[#F4F3ED] p-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#171717]">
                    #{idx + 1} {sp.name}
                  </span>
                  <div className="text-[10px] text-[#777777]">
                    {sp.buildingName} · {sp.studyType}
                  </div>
                </div>
                <div className="text-right">
                  <span className="border border-[#171717] bg-[#171717] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {sp.bookingCount} bookings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Used */}
        <div className="border border-[#BDBDBD] bg-white p-5">
          <div className="border-b border-[#BDBDBD] pb-3 mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#777777]">
              Available Capacity
            </span>
            <h4 className="text-sm font-black uppercase tracking-tight text-[#171717]">
              Least-Utilized Spaces
            </h4>
          </div>
          <div className="space-y-2">
            {leastUsedSpaces.map((sp) => (
              <div
                key={sp.id}
                className="flex items-center justify-between border border-[#BDBDBD] bg-[#F4F3ED] p-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#171717]">{sp.name}</span>
                  <div className="text-[10px] text-[#777777]">
                    {sp.buildingName} · {sp.studyType}
                  </div>
                </div>
                <div className="text-right">
                  <span className="border border-[#BDBDBD] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#777777]">
                    {sp.bookingCount} bookings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Building-wise Breakdown & Peak Hours */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Usage by Building */}
        <div className="border border-[#BDBDBD] bg-white p-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#171717] border-b border-[#BDBDBD] pb-3 mb-4">
            Building Distribution
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#777777] uppercase text-[9px] font-bold border-b border-[#BDBDBD]">
                <tr>
                  <th className="pb-2">Building</th>
                  <th className="pb-2">Spaces</th>
                  <th className="pb-2">Seats</th>
                  <th className="pb-2 text-right">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BDBDBD] text-[#171717]">
                {buildingStats.map((b) => (
                  <tr key={b.buildingName} className="hover:bg-[#F4F3ED]">
                    <td className="py-2.5 font-bold">{b.buildingName}</td>
                    <td className="py-2.5">{b.spacesCount}</td>
                    <td className="py-2.5">{b.seatCount}</td>
                    <td className="py-2.5 text-right font-black text-[#F15A24]">{b.bookingCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Peak-time distribution */}
        <div className="border border-[#BDBDBD] bg-white p-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#171717] border-b border-[#BDBDBD] pb-3 mb-4">
            Peak Time Slot Analysis
          </h4>
          <div className="space-y-3 text-xs">
            {peakTimeDistribution.map(({ slot, count }) => {
              const maxCount = Math.max(...peakTimeDistribution.map((p) => p.count), 1);
              const barWidth = Math.max(10, Math.round((count / maxCount) * 100));

              return (
                <div key={slot}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#171717] mb-1">
                    <span>{slot}</span>
                    <span className="font-mono text-[#F15A24]">{count} reservations</span>
                  </div>
                  <div className="h-2 w-full border border-[#BDBDBD] bg-[#F4F3ED]">
                    <div
                      className="h-full bg-[#171717]"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
