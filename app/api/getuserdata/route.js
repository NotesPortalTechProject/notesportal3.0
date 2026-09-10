import { getMyFiles, getUserData } from "@/lib/data-fetch-functions";
import { getCurrentSession } from "@/lib/session";

export async function POST(req) {
  try {
    const currSesh = await getCurrentSession();
    if(!currSesh){
      return Response.json({success:false,error:"Unauthorized Access"},{status:401})
    }
    const userid = currSesh.userId;
    // not using the chindi chor id received from req body not secure
    const { timepassid } = await req.json();
    if (!userid) return Response.json({ success: false, error: "Missing userid" }, { status: 400 });

    const userdata = await getUserData(userid);
    const myfiles = await getMyFiles(userid);
    const myFilesLength = myfiles.length;
    return Response.json({ success: true, userdata, myFilesLength });
  } catch (error) {
    console.error("POST /get-user-data error:", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
