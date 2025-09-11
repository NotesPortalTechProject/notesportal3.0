import { getUserData } from '@/lib/data-fetch-functions';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { error } from 'console';

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_URL,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

function errorBuilder(code, text, details, status = 500) {
    console.error(`${code} ${text} `, details || "");
    return NextResponse.json(
        {
            success: false,
            error: { code, text, details }
        },
        { status }
    )
}

export async function POST(req) {
    try {
        // DATA KADLA
        const formData = await req.formData();
        const subjectcode = formData.get("scode").toUpperCase();
        const filename = formData.get("filename").toUpperCase();
        const description = formData.get("description");
        const file = formData.get("file");
        const userid = formData.get("userid");
        const userdata = await getUserData(userid);
        const username = userdata['username'];
        // FILE AHE KA
        if (!file) {
            return errorBuilder("NO_FILE", "No file provided", null, 400);
        }
        // FILE HASH KELI
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
        // DUPLICATE AHE KA
        const { data: exists, error: selectError } = await supabase.from("notes").select("id").eq("hash", fileHash);
        if (selectError) {
            return errorBuilder("SUPABASE_SELECT_ERROR", "Couldnt select file to check for duplicate", selectError.message);
        }
        if (exists && exists.length > 0) {
            return errorBuilder("DUPLICATE_FILE", "File already exists", null, 409);
        }
        // FILETYPE CHECK MARA
        let tempfileType = "other";
        if (file.type.includes("pdf")) tempfileType = "pdf";
        else if (file.type.includes("msword")) tempfileType = "doc";
        else if (file.type.includes("wordprocessingml.document")) tempfileType = "docx";
        else if (file.type.includes("ms-powerpoint")) tempfileType = "ppt";
        else if (file.type.includes("presentationml.presentation")) tempfileType = "pptx";

        const tempfilename = `${subjectcode}_${filename}`;
        const filekey = `${tempfilename}.${tempfileType}`;
        // R2 UPLOAD MARA
        try{
            await s3.send(
                new PutObjectCommand({
                    Bucket:process.env.R2_BUCKET,
                    Key:filekey,
                    Body:fileBuffer,
                    ContentType:file.type
                })
            )
        }
        catch(err){
            return errorBuilder("R2_UPLOAD_ERROR","Failed to upload to bucket",err.message);
        }
        // SUPABASE MADHE INSERT
        const filelink = `${process.env.CLOUDFARE_PUBLIC_URL}/${filekey}`;
        const {error:insertError} = await supabase.from("notes").insert([
            {
                filename:tempfilename,
                subjectname:subjectcode,
                filetype:tempfileType,
                filelink,
                uploaded_by:username,
                description,
                hash:fileHash
            }
        ]);

        if(insertError){
            return errorBuilder("SUPABASE_INSERT_ERROR","Failed to insert metdata into supabase",insertError.message);
        }

        return NextResponse.json({success:true},{status:200});
    } catch (err) {
        return errorBuilder("SERVER_ERROR","Unexpected server error",err.message);
    }
}