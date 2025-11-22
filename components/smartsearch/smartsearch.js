"use client";
import { useState, useRef } from "react";
import SSFilesGrid from "./ssfilesgrid";
import LoadingDots from "../loadingDots";

export default function SmartSearch({ userid }) {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showFallback, setShowFallback] = useState(true);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    setError(null);
    setSuccess(null);
    setFiles([]);
    setShowFallback(false);

    if (!query || query.trim().length < 5) {
      setError("Please enter at least 5 characters.");
      setShowFallback(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/smartsearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");

      if (data.filelist && data.filelist.length > 0) {
        setFiles(data.filelist);
        setSuccess("Search completed successfully!");
      } else {
        setSuccess("No files found for your search.");
      }
    } catch (err) {
      setError(err.message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 text-white flex flex-col gap-6">

      {/* Title & Subtitle */}
      <div className="max-w-full sm:max-w-2xl">
        <h1 className="text-lg sm:text-xl font-bold text-purple-300">
          SmartSearch
        </h1>
        <p className="mt-1 text-gray-400 text-xs sm:text-sm">
          Search for any TOPIC and SmartSearch will fetch the most relevant PDF files from the database.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-full sm:max-w-3xl">

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          className="
            flex-1 p-4 rounded-2xl bg-white/5 backdrop-blur-xl
            border border-purple-500/20 text-white placeholder:text-gray-400
            focus:ring-2 focus:ring-purple-500 focus:outline-none
            transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.15)]
          "
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="
            w-full sm:w-auto px-6 py-4 rounded-2xl
            bg-purple-700 hover:bg-purple-600 text-white font-semibold
            shadow-[0_0_25px_rgba(168,85,247,0.25)]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          {loading ? <LoadingDots text="Looking for files" /> : "Search"}
        </button>
      </div>
        {loading && <LoadingDots text="This process may take some time. Thank you for your patience." />}

      {/* Success Message */}
      {success && (
        <div className="
          border border-green-500/50 rounded-xl p-3 text-green-400 text-sm
          bg-green-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.2)]
          max-w-full sm:max-w-3xl
        ">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="
          border border-red-500/50 rounded-xl p-3 text-red-400 text-sm
          bg-red-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]
          max-w-full sm:max-w-3xl
        ">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && files.length > 0 && (
        <div className="max-w-full mt-4">
          <p className="text-gray-300 mb-4 text-sm sm:text-base">
            Based on your search, we found these files:
          </p>

          <div className=" p-4 sm:p-6 ">
            <SSFilesGrid files={files} id={userid} />
          </div>
        </div>
      )}
    </div>
  );
}
