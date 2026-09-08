import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { filearray, prompt } = await req.json();

    if (!filearray || !Array.isArray(filearray) || !prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "filearray (array) and prompt (string) are required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.PYTHON_API_URL+"/pdfchat" || "http://127.0.0.1:8000/pdfchat";
    console.log("Using PDF API URL:", apiUrl);
    const queryParams = new URLSearchParams({ prompt });

    const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filearray }),
      signal: req.signal,
    });

    if (!response.ok || !response.body) {
      const text = await response.text().catch(() => "");
      console.error("PDF API Error Response:", text);
      return new Response("An unexpected error occurred, failed to get answer.", {
        status: response.status || 500,
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("PDF Chat Error:", err);
    return new Response(err.message || "Something went wrong", { status: 500 });
  }
}