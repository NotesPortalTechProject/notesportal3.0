export default function LoadingFallBack() {
  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-[#1a1a1a]">
      {" "}
      <div className="w-20 h-20 relative bg-white/5 border border-white/20 rounded-full backdrop-blur-md shadow-md flex items-center justify-center">
        {" "}
        <div
          className="w-10 h-10 rounded-full animate-spin bg-gradient-to-tr from-purple-500 to-purple-900"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, black 60%, transparent 61%)",
            maskImage: "radial-gradient(circle, black 60%, transparent 61%)",
          }}
        />{" "}
      </div>{" "}
    </div>
  );
}
