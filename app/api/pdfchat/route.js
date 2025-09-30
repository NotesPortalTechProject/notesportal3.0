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
      body: JSON.stringify({ filearray }) 
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("PDF API Error Response:", text);
      throw new Error("Failed to connect to PDF API");
    }

    const data = await response.json();
    return NextResponse.json({ answer: data });
  } catch (err) {
    console.error("PDF Chat Error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}