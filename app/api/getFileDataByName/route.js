import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) throw new Error("Filename is required");

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("filename", filename)
      .single();

    if (error) throw error;

    return NextResponse.json({ file: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch file data" }, { status: 500 });
  }
}
