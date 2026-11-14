"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-[#171717] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] hover:bg-[#171717] hover:text-white transition"
    >
      Print Pass 🖨
    </button>
  );
}
