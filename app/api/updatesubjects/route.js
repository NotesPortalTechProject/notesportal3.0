import { getCurrentSession } from "@/lib/session";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server"

export async function PUT(req) {
    try{
        const currSesh = await getCurrentSession();
        if(!currSesh){
            return NextResponse.json({error:"Unauthorized Access"},{status:401});
        }
        const id = currSesh.userId;
        // not using nalla id from req body
        const {timepassid,subjects} = await req.json()
        if(!id||!subjects||!Array.isArray(subjects)){
            return NextResponse.json(
                {error:"Inavid Request Data"},
                {status:400}
            );
        }

        if(subjects.length===0){
            return NextResponse.json(
                {error:"At least one subject is required"},
                {status:400}
            );
        }
        const subjectsText = JSON.stringify(subjects)
        const {error} = await supabase.from("users").update({subjects:subjectsText}).eq("id",id);

        if(error){
            return NextResponse.json(
                {error:"Failed to update subjects"},
                {status:500}
            )
        }

        return NextResponse.json(
            {success:true},
            {status:200}

        )
    }catch(error){
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }
}