import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="border border-[#171717] bg-[#171717] px-6 py-3 text-4xl font-black text-white">
        404
      </div>
      <h2 className="mt-6 text-3xl font-black uppercase tracking-tight text-[#171717]">
        Space Not Found
      </h2>
      <p className="mt-2 max-w-sm text-xs text-[#777777] leading-relaxed">
        The campus room, desk, or reservation pass you requested does not exist or may have been relocated.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/spaces"
          className="border border-[#F15A24] bg-[#F15A24] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
        >
          Explore Campus Spaces
        </Link>
        <Link
          href="/"
          className="border border-[#BDBDBD] bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171717] hover:border-[#171717] transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
