export default function LoadingSpinner({ text = "Loading...", size = "md" }) {
  const spinnerSize =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
      ? "h-10 w-10 border-4"
      : "h-6 w-6 border-3";

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div
        className={`animate-spin rounded-full border-solid border-[#F15A24] border-t-transparent ${spinnerSize}`}
        role="status"
        aria-label="loading"
      />
      {text && (
        <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#777777]">
          {text}
        </p>
      )}
    </div>
  );
}
