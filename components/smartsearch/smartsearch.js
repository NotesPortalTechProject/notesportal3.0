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
    <div className="min-h-screen w-full p-2 text-white flex flex-col gap-6">
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold text-purple-300">SmartSearch</h1>
        <p className="mt-1 text-gray-400 text-xs">
          Ask any question and SmartSearch will find the most relevant PDF files from our database.
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-3xl">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          className="flex-1 p-4 rounded-xl border border-purple-500/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-white/50"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg flex items-center justify-center disabled:opacity-50 transition"
        >
          Search
        </button>
      </div>

      {success && (
        <div className="border border-green-500/50 rounded-md p-3 text-green-400 text-sm max-w-3xl">
          {success}
        </div>
      )}

      {error && (
        <div className="border border-red-500/50 rounded-md p-3 text-red-400 text-sm max-w-3xl">
          {error}
        </div>
      )}

      {!loading && files.length > 0 && (
        <div className="max-w-5xl">
          <p className="text-gray-300 mb-4">
            Based on your search, we were able to gather these files:
          </p>
          <SSFilesGrid files={files} id={userid} />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mt-8">
          <LoadingDots text="Searching" />
        </div>
      )}
    </div>
  );
}