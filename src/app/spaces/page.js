import Link from "next/link";
import SpaceExplorer from "@/components/SpaceExplorer";
import { studySpaces } from "@/lib/spaces";

export const metadata = {
  title: "Explore Study Spaces | StudySpace",
  description: "Search study spaces by location, type, and availability."
};

export default function SpacesPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-forest"><span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">S</span>StudySpace</Link>
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-forest">Home</Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <SpaceExplorer spaces={studySpaces} />
      </div>
      <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center text-sm text-slate-500">StudySpace · Module 1: Study Space Discovery</footer>
    </main>
  );
}