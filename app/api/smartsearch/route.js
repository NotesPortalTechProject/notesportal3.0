import { getFileObjectsListByFileLinkList } from "@/lib/data-fetch-functions";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
            return NextResponse.json(
                { error: "Invalid or empty prompt" },
                { status: 400 }
            );
        }

         const apiUrl = process.env.PYTHON_API_URL 
           ? `${process.env.PYTHON_API_URL}/smartsearch`
            : "http://127.0.0.1:8000/smartsearch";

        const queryParams = new URLSearchParams({ prompt });

        const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Flask API returned ${response.status}`);
        }

        const fileLinkList = await response.json();
        if (!Array.isArray(fileLinkList)) {
            return NextResponse.json(
                { error: "Unexpected response format from Flask API" },
                { status: 500 }
            );
        }

        const { fileObjectList, state } = await getFileObjectsListByFileLinkList(fileLinkList);

        if (!state) {
            return NextResponse.json(
                { error: "Failed to fetch one or more files from Supabase" },
                { status: 500 }
            );
        }

        return NextResponse.json({ filelist: fileObjectList });
    } catch (err) {
        console.error("SmartSearch API Error:", err);
        return NextResponse.json(
            { error: err.message || "Unexpected server error" },
            { status: 500 }
        );
    }
}
