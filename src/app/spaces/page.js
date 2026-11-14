import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import SpaceExplorer from "@/components/discovery/SpaceExplorer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Campus Study Spaces | StudySpace",
  description: "Search and filter university study areas by building, floor, zone, capacity, and live availability.",
};

/**
 * Helper to retry async functions up to `maxAttempts` times.
 */
async function retryAsync(fn, maxAttempts = 2) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxAttempts) throw err;
      console.warn(`Retry attempt ${attempt} for DB query failed:`, err);
    }
  }
}

/**
 * Build a MongoDB query object from URL search parameters.
 * Supports:
 *   - q (text search across name, building, floor, zone, studyType, facilities)
 *   - type (exact match on studyType)
 *   - availability (Available, Limited, Full)
 *   - building (exact match)
 *   - floor (exact match)
 *   - minCapacity (numeric, totalSeats >= value)
 */
function buildQuery(params) {
  const query = { isActive: true };
  if (params.q) {
    const regex = new RegExp(params.q, "i");
    query.$or = [
      { name: regex },
      { buildingName: regex },
      { building: regex },
      { floor: regex },
      { zone: regex },
      { location: regex },
      { studyType: regex },
      { facilities: { $elemMatch: regex } },
    ];
  }
  if (params.type && params.type !== "All types") {
    query.studyType = params.type;
  }
  if (params.building && params.building !== "All locations") {
    // Support both buildingName and building fields.
    query.$or = query.$or || [];
    query.$or.push({ buildingName: params.building }, { building: params.building });
  }
  if (params.floor && params.floor !== "All floors") {
    query.floor = params.floor;
  }
  if (params.minCapacity) {
    const min = parseInt(params.minCapacity, 10);
    if (!isNaN(min)) query.totalSeats = { $gte: min };
  }
  // Availability will be filtered after seat counts.
  return query;
}

async function getSpaces(searchParams) {
  // Convert URLSearchParams (or plain object) to plain object.
  const params = typeof searchParams === "object" && !(searchParams instanceof URLSearchParams)
    ? searchParams
    : Object.fromEntries(searchParams.entries ? searchParams.entries() : []);

  await connectDB();
  const baseQuery = buildQuery(params);

  // Fetch spaces using retry logic.
  const spaces = await retryAsync(() =>
    StudySpace.find(baseQuery).sort({ createdAt: -1 }).lean()
  );

  // Enrich with live seat availability and apply availability filter.
  const enriched = await Promise.all(
    spaces.map(async (sp) => {
      const availableCount = await Seat.countDocuments({
        studySpaceId: sp._id,
        status: "Available",
      });
      let calculatedAvailability = "Available";
      if (availableCount === 0) calculatedAvailability = "Full";
      else if (availableCount <= Math.max(1, Math.floor((sp.totalSeats || 1) * 0.25)))
        calculatedAvailability = "Limited";

      // Filter by availability if requested.
      if (params.availability && params.availability !== "Any availability") {
        if (calculatedAvailability.toLowerCase() !== params.availability.toLowerCase()) {
          return null; // filtered out
        }
      }

      return {
        ...sp,
        id: sp._id.toString(),
        _id: sp._id.toString(),
        availableSeats: availableCount,
        totalSeats: sp.totalSeats || 0,
        availability: calculatedAvailability,
      };
    })
  );

  // Remove any null entries caused by availability filter and ensure plain serializable objects
  return JSON.parse(JSON.stringify(enriched.filter(Boolean)));
}

export default async function SpacesPage({ searchParams }) {
  const spaces = await getSpaces(searchParams);
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <SpaceExplorer initialSpaces={spaces} />
    </div>
  );
}
