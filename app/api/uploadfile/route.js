import { getUserData } from '@/lib/data-fetch-functions';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

function errorResponse(code, text, details = null, status = 500) {
  console.error(`${code} ${text}`, details || "");
  return NextResponse.json(
    {
      success: false,
      error: { code, text, details }
    },
    { status }
  );
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const subjectcode = formData.get("scode")?.toUpperCase();
    const filename = formData.get("filename")?.toUpperCase();
    const description = formData.get("description");
    const file = formData.get("file");
    const userid = formData.get("userid");
    const userdata = await getUserData(userid);
    const username = userdata?.username;

    if (!file) {
      return errorResponse("NO_FILE", "No file provided", null, 400);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    // CHECKING FOR DUPLICATES
    const { data: exists, error: selectError } = await supabase.from("notes").select("id").eq("hash", fileHash);
    if (selectError) {
      return errorResponse("SUPABASE_SELECT_ERROR", "Failed to query Supabase", selectError.message);
    }

    if (exists && exists.length > 0) {
      return errorResponse("DUPLICATE_FILE", "Duplicate! file already exists", null, 409);
    }

    let tempfileType = "other";
    if (file.type.includes("pdf")) tempfileType = "pdf";
    else if (file.type.includes("msword")) tempfileType = "doc";
    else if (file.type.includes("wordprocessingml.document")) tempfileType = "docx";
    else if (file.type.includes("ms-powerpoint")) tempfileType = "ppt";
    else if (file.type.includes("presentationml.presentation")) tempfileType = "pptx";

    const tempfilename = `${subjectcode}_${filename}`;
    const fileKey = `${tempfilename}.${tempfileType}`;

    // UPLOADING TO BUCKET
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: file.type,
        })
      );
    } catch (err) {
      return errorResponse("R2_UPLOAD_ERROR", "Failed to upload to R2", err.message);
    }

    // Insert into Supabase
    const filelink = `${process.env.CLOUDFARE_PUBLIC_URL}/${fileKey}`;
    const { error: insertError } = await supabase.from("notes").insert([
      {
        filename: tempfilename,
        subjectname: subjectcode,
        filetype: tempfileType,
        filelink,
        uploaded_by: username,
        description,
        hash: fileHash,
      },
    ]);

    if (insertError) {
      return errorResponse("SUPABASE_INSERT_ERROR", "Failed to insert into Supabase", insertError.message);
    }

    return NextResponse.json({ success: true}, { status: 200 });

  } catch (err) {
    return errorResponse("SERVER_ERROR", "Unexpected server error", err.message);
  }
}
