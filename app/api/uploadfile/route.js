import { getUserData } from "@/lib/data-fetch-functions";
import { getCurrentSession } from "@/lib/session";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try{
    const currSesh = await getCurrentSession();
    if(!currSesh){
      return NextResponse.json({success:false,error:{text:"Unauthorized Access"}},{status:401});
    }
    const userid = currSesh.userId;
    // not using the id received from req body not secure
    const { subjectcode, filename, description, timepassid, fileKey, filetype, hash } = await req.json();

    const userdata = await getUserData(userid);
    const username = userdata?.username || "Notesportal";

    const filelink = `${process.env.CLOUDFARE_PUBLIC_URL}/${fileKey}`;

    const {error:insertError} = await supabase.from("notes").insert([
      {
        filename:`${subjectcode}_${filename}`,
        subjectname:subjectcode,
        filetype,
        filelink,
        uploaded_by: username,
        description,
        hash,
      }
    ]);

    if(insertError){
      return NextResponse.json({ success: false, error: { text: insertError.message } }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch(err){
    return NextResponse.json({ success: false, error: { text: err.message } }, { status: 500 });
  }
}