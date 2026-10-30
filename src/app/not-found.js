import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div><p className="text-sm font-bold uppercase tracking-widest text-forest">404 · Not found</p><h1 className="mt-3 text-4xl font-bold">We couldn't find that space.</h1><p className="mt-3 text-slate-500">The study space may have been removed or the link may be incorrect.</p><Link href="/spaces" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 font-semibold text-white">Explore spaces</Link></div>
    </main>
  );
}