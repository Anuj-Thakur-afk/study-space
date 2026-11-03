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
      {/* Overview Cards */}
      <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#263653]">Overall Campus Occupancy Distribution</h3>
            <p className="text-xs text-[#777777] mt-0.5">
              Real-time ratio of seats currently free, reserved, occupied, or under maintenance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/export?type=bookings"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#263653] bg-white px-3.5 py-2 text-xs font-bold text-[#263653] hover:bg-[#263653] hover:text-white transition shadow-sm"
            >
              📥 Export Bookings CSV
            </a>
            <a
              href="/api/admin/export?type=spaces"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F5F2EA] px-3.5 py-2 text-xs font-bold text-[#263238] hover:border-[#263653] transition shadow-sm"
            >
              📥 Export Spaces CSV
            </a>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-100 flex">
          <div
            title={`Available: ${availablePct}%`}
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${availablePct}%` }}
          />
          <div
            title={`Booked: ${bookedPct}%`}
            className="bg-rose-500 h-full transition-all"
            style={{ width: `${bookedPct}%` }}
          />
          <div
            title={`Occupied: ${occupiedPct}%`}
            className="bg-amber-500 h-full transition-all"
            style={{ width: `${occupiedPct}%` }}
          />
          <div
            title={`Unavailable: ${unavailablePct}%`}
            className="bg-slate-300 h-full transition-all"
            style={{ width: `${unavailablePct}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-emerald-50 p-3">
            <span className="text-emerald-800 font-bold block">Available</span>
            <span className="text-lg font-extrabold text-emerald-900">{stats.availableSeats || 0}</span>
            <span className="text-[11px] text-emerald-700 ml-1">({availablePct}%)</span>
          </div>
          <div className="rounded-xl bg-rose-50 p-3">
            <span className="text-rose-800 font-bold block">Booked</span>
            <span className="text-lg font-extrabold text-rose-900">{stats.bookedSeats || 0}</span>
            <span className="text-[11px] text-rose-700 ml-1">({bookedPct}%)</span>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <span className="text-amber-800 font-bold block">Occupied</span>
            <span className="text-lg font-extrabold text-amber-900">{stats.occupiedSeats || 0}</span>
            <span className="text-[11px] text-amber-700 ml-1">({occupiedPct}%)</span>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <span className="text-slate-600 font-bold block">Unavailable</span>
            <span className="text-lg font-extrabold text-slate-800">{stats.unavailableSeats || 0}</span>
            <span className="text-[11px] text-slate-500 ml-1">({unavailablePct}%)</span>
          </div>
        </div>
      </div>

      {/* Most-Used & Least-Used Spaces */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Most Used */}
        <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-lg">🔥</span>
            <div>
              <h4 className="text-sm font-bold text-[#263653]">Most-Utilized Study Spaces</h4>
              <p className="text-[11px] text-[#777777]">Highest student reservation volume</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {mostUsedSpaces.map((sp, idx) => (
              <div
                key={sp.id}
                className="flex items-center justify-between rounded-xl bg-[#F5F2EA] p-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#263653]">
                    #{idx + 1} {sp.name}
                  </span>
                  <div className="text-[11px] text-[#777777]">
                    {sp.buildingName} · {sp.studyType}
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-[#263653] px-2.5 py-1 text-[11px] font-bold text-white">
                    {sp.bookingCount} bookings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Used */}
        <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-lg">❄️</span>
            <div>
              <h4 className="text-sm font-bold text-[#263653]">Least-Utilized Study Spaces</h4>
              <p className="text-[11px] text-[#777777]">Opportunities to divert student traffic</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {leastUsedSpaces.map((sp, idx) => (
              <div
                key={sp.id}
                className="flex items-center justify-between rounded-xl bg-[#F5F2EA] p-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#263653]">{sp.name}</span>
                  <div className="text-[11px] text-[#777777]">
                    {sp.buildingName} · {sp.studyType}
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#777777]">
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
        <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
          <h4 className="text-sm font-bold text-[#263653] border-b border-slate-100 pb-3">
            Usage Breakdown by Campus Building
          </h4>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#777777] uppercase text-[10px] font-bold">
                <tr>
                  <th className="pb-2">Building</th>
                  <th className="pb-2">Spaces</th>
                  <th className="pb-2">Seats</th>
                  <th className="pb-2 text-right">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#263238]">
                {buildingStats.map((b) => (
                  <tr key={b.buildingName}>
                    <td className="py-2.5 font-bold text-[#263653]">{b.buildingName}</td>
                    <td className="py-2.5">{b.spacesCount}</td>
                    <td className="py-2.5">{b.seatCount}</td>
                    <td className="py-2.5 text-right font-bold text-[#E69A68]">{b.bookingCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Peak-time distribution */}
        <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
          <h4 className="text-sm font-bold text-[#263653] border-b border-slate-100 pb-3">
            Peak Time Slot Analysis
          </h4>
          <div className="mt-4 space-y-2.5 text-xs">
            {peakTimeDistribution.map(({ slot, count }) => {
              const maxCount = Math.max(...peakTimeDistribution.map((p) => p.count), 1);
              const barWidth = Math.max(10, Math.round((count / maxCount) * 100));

              return (
                <div key={slot}>
                  <div className="flex justify-between text-[11px] font-semibold text-[#263653] mb-1">
                    <span>{slot}</span>
                    <span>{count} reservations</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#263653]"
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
