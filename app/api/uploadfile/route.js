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
        console.log("🚀 Starting file upload process...");
        
        const formData = await req.formData();
        console.log("✅ Form data received successfully");
        
        const subjectcode = formData.get("scode")?.toUpperCase();
        const filename = formData.get("filename")?.toUpperCase();
        const description = formData.get("description");
        const file = formData.get("file");
        const userid = formData.get("userid");
        
        console.log("📝 Form data extracted:", {
            subjectcode,
            filename,
            description: description ? "provided" : "missing",
            file: file ? `size: ${file.size} bytes, type: ${file.type}` : "missing",
            userid
        });
        
        if (!subjectcode || !filename || !file || !userid) {
            console.error("❌ Missing required form data");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        console.log("🔍 Fetching user data for userid:", userid);
        const userdata = await getUserData(userid);
        console.log("✅ User data fetched:", userdata ? "success" : "failed");
        
        if (!userdata) {
            console.error("❌ User data not found for userid:", userid);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        const username = userdata['username'];
        console.log("👤 Username extracted:", username);

        console.log("📄 Processing file buffer...");
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        console.log("✅ File buffer created, size:", fileBuffer.length, "bytes");
        
        console.log("🔐 Generating file hash...");
        const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
        console.log("✅ File hash generated:", fileHash.substring(0, 10) + "...");

        console.log("🔍 Checking for duplicate files in database...");
        const { data: exists, error: selectError } = await supabase.from("notes").select("id").eq("hash", fileHash);
        
        if (selectError) {
            console.error("❌ Database select error:", selectError);
            return NextResponse.json({ error: "Database error", details: selectError }, { status: 500 });
        }
        
        if (exists && exists.length > 0) {
            console.log("⚠️ Duplicate file detected");
            return NextResponse.json({ error: "Duplicate! file already exists" }, { status: 409 });
        }
        console.log("✅ No duplicate found, proceeding with upload");

        console.log("📝 Preparing file metadata...");
        const tempfilename = `${subjectcode}_${filename}`
        const fileType = file.type
        let tempfileType;

        if(fileType.includes("pdf")){
            tempfileType="pdf";
        }else if(fileType.includes("msword")){
            tempfileType="doc";
        }else if(fileType.includes("wordprocessingml.document")){
            tempfileType="docx";
        }else if(fileType.includes("ms-powerpoint")){
            tempfileType="ppt";
        }else if(fileType.includes("presentationml.presentation")){
            tempfileType="pptx";
        }else{
            tempfileType="other";
        }
        
        console.log("📋 File metadata:", {
            tempfilename,
            fileType,
            tempfileType
        });

        console.log("☁️ Uploading to R2/S3...");
        console.log("🔧 S3 Config check:", {
            region: "auto",
            endpoint: process.env.R2_URL ? "✅ Set" : "❌ Missing",
            accessKey: process.env.R2_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing",
            secretKey: process.env.R2_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing",
            bucket: process.env.R2_BUCKET ? "✅ Set" : "❌ Missing"
        });
        
        try {
            await s3.send(
                new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET,
                    Key: `${tempfilename}.${tempfileType}`,
                    Body: fileBuffer,
                    ContentType: file.type
                })
            );
            console.log("✅ File uploaded to R2/S3 successfully");
        } catch (s3Error) {
            console.error("❌ S3/R2 upload failed:", s3Error);
            return NextResponse.json({ error: "File upload failed", details: s3Error.message }, { status: 500 });
        }

        console.log("🔗 Generating file link...");
        const filelink = `${process.env.CLOUDFARE_PUBLIC_URL}/${tempfilename}.${tempfileType}`;
        console.log("✅ File link generated:", filelink);
        console.log("🔧 Cloudflare URL check:", process.env.CLOUDFARE_PUBLIC_URL ? "✅ Set" : "❌ Missing");

        console.log("💾 Inserting record into database...");
        const { error: insertError } = await supabase.from("notes").insert([
            { filename:tempfilename, subjectname: subjectcode, filetype: tempfileType, filelink, uploaded_by:username, description, hash: fileHash }
        ]);

        if (insertError) {
            console.error("❌ Database insert error:", insertError);
            return NextResponse.json({ error: "Failed to insert into Supabase", details: insertError }, { status: 500 });
        }
        console.log("✅ Record inserted into database successfully");

        console.log("🎉 File upload process completed successfully!");
        return NextResponse.json({ success: true, filelink }, { status: 200 });

    } catch (err) {
        console.error("💥 Unexpected error in upload process:", err);
        console.error("📍 Error stack:", err.stack);
        return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
    }
}
