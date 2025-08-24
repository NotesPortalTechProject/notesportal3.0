import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
    region:"",
    endpoint:`https://${process.env.CLOUDFARE_ACCOUNT_ID}.r2.cloudfarestorage.com`,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY_ID,
        secretAccessKey:process.env.SECRET_ACCESS_KEY
    }
})