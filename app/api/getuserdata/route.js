import { getUserData } from "@/lib/data-fetch-functions";

export async function POST(req) {
  try {
    const { userid } = await req.json();
    if (!userid) return Response.json({ success: false, error: "Missing userid" }, { status: 400 });

    const userdata = await getUserData(userid);
    return Response.json({ success: true, userdata });
  } catch (error) {
    console.error("POST /get-user-data error:", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
