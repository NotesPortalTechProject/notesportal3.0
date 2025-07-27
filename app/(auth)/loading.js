export default function LoadingFallBack() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-black">
      <div className="flex flex-col items-center gap-6 px-10 py-8 bg-white/5 border border-white/20 backdrop-blur-md rounded-2xl shadow-xl">
        
        {/* Gradient Spinner */}
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full border-8 border-white/10" />
          <div className="w-full h-full rounded-full animate-spin-slow bg-gradient-to-b from-[#222] to-purple-900/60" 
               style={{
                 WebkitMaskImage: 'linear-gradient(to top, transparent 40%, black 100%)',
                 maskImage: 'linear-gradient(to top, transparent 40%, black 100%)'
               }} />
        </div>

        <p className="text-white/90 text-xl font-semibold tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
