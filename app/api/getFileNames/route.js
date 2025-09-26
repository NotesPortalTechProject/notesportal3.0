import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    if (!subject) throw new Error("Subject is required");

    const { data, error } = await supabase
      .from("notes")
      .select("filename, filelink")
      .eq("subjectname", subject)
      .eq("filetype", "pdf");

    if (error) throw error;

    return NextResponse.json({ files: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch files" }, { status: 500 });
  }
}
