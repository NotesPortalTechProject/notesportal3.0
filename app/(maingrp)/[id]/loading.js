export default function LoadingFallBack() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/20 rounded-2xl shadow-md">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white/80 text-lg font-medium tracking-wide">Loading, please wait...</p>
      </div>
    </div>
  );
}
