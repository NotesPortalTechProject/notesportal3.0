import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        console.log("SMART SEARCH ROUTE HIT");
        const prompt = await request.json();
        console.log("Prompt:", prompt);
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }
        const url =
            `${process.env.PYTHON_API_URL}/smartsubjectsearch` +
            `?prompt=${encodeURIComponent(prompt.trim())}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("FastAPI response code:", response.status);
        const text = await response.text();
        console.log("FastAPI response:", text);
        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "Subject search failed",
                    details: text,
                },
                {
                    status: response.status,
                }
            );
        }

        let result;

        try {
            result = JSON.parse(text);
        } catch {
            console.error("FastAPI returned invalid JSON:", text);

            return NextResponse.json(
                {
                    error: "FastAPI returned invalid JSON",
                    details: text,
                },
                {
                    status: 500,
                }
            );
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("SMART SEARCH ROUTE ERROR:", error);
        return NextResponse.json(
            {
                error: "Internal Server error",
                details: error.message,
            },
            {
                status: 500,
            }
        );
    }
}