import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#DCE5DC] text-3xl font-extrabold text-[#263653]">
        404
      </div>
      <h2 className="mt-4 text-2xl font-extrabold text-[#263653]">Study Space Not Found</h2>
      <p className="mt-2 max-w-sm text-xs text-[#777777] leading-relaxed">
        The campus room, desk, or reservation pass you requested does not exist or may have been relocated.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/spaces"
          className="rounded-full bg-[#263653] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
        >
          Explore Campus Spaces
        </Link>
        <Link
          href="/"
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-[#263238] hover:border-[#263653] transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
