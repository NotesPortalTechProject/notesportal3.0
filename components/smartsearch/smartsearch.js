"use client";
import { useState } from "react";
import SSFilesGrid from "./ssfilesgrid";

export default function SmartSearch({userid}) {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setError(null);
        if (!query || query.trim().length < 5) {
            setError("Please enter at least 5 characters.");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch("/api/smartsearch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: query })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Search failed");
            }

            setFiles(data.filelist || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 glassmorphism rounded-2xl shadow-md">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask your question..."
                    className="flex-1 p-2 rounded-xl border bg-white/30 backdrop-blur-md focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {!loading && files.length > 0 && (
                <div className="mt-6">
                    <SSFilesGrid files={files} id={userid} />
                </div>
            )}

            {!loading && !error && files.length === 0 && (
                <p className="text-gray-500 mt-4">No files found yet. Try searching above.</p>
            )}
        </div>
    );
}
