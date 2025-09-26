import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userid");

    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("users")
      .select("subjects")
      .eq("id", userId)
      .single();

    if (error) throw error;

    const subjects = data.subjects ? JSON.parse(data.subjects) : [];

    return NextResponse.json({ subjects });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch subjects" }, { status: 500 });
  }
}
