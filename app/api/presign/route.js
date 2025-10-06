import { supabase } from "@/lib/supabaseClient";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import crypto from "crypto";

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
        const { subjectcode, filename, description, userid, type, hash, extension } = await req.json();

        if (!subjectcode || !filename || !type || !userid || !description) {
            return NextResponse.json({ success: false, error: { text: "Missing fields" } }, { status: 400 });
        }

        const { data: exists, error: selectError } = await supabase.from("notes").select("id").eq("hash", hash);
        if (selectError) {
            return NextResponse.json({ success: false, error: { text: "Upload Failed" } }, { status: 500 });
        }

        if (exists && exists.length > 0) {
            return NextResponse.json({ success: false, error: { text: "Duplicate file, resource already exists !" } }, { status: 409 });
        }

        const fileKey = `${subjectcode}_${filename}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: fileKey,
            ContentType: type,
        })

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        return NextResponse.json({ success: true, uploadUrl, fileKey }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: { text: err.message } }, { status: 500 });
    }
}