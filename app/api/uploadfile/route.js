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

export async function POST(req) {
    try {
        const formData = await req.formData();
        const subjectcode = formData.get("scode").toUpperCase();
        const filename = formData.get("filename").toUpperCase();
        const description = formData.get("description");
        const file = formData.get("file");
        const userid = formData.get("userid");
        const userdata = await getUserData(userid);
        const username = userdata['username'];

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        const { data: exists, error: selectError } = await supabase.from("notes").select("id").eq("hash", fileHash);
        if (exists && exists.length > 0) {
            return NextResponse.json({ error: "Duplicate! file already exists" }, { status: 409 });
        }

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: filename,
                Body: fileBuffer,
                ContentType: file.type
            })
        );

        const filelink = `${process.env.CLOUDFARE_PUBLIC_URL}/${filename}`;
        const tempfilename = `${subjectcode}_${filename}`
        const { error: insertError } = await supabase.from("notes").insert([
            { filename:tempfilename, subjectname: subjectcode, filetype: file.type, filelink, uploaded_by:username, description, hash: fileHash }
        ]);

        if (insertError) {
            return NextResponse.json({ error: "Failed to insert into Supabase", details: insertError }, { status: 500 });
        }

        return NextResponse.json({ success: true, filelink }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
    }
}
