'use server'
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";


const secretkey = process.env.SESSION_SECRET;
const encodedkey = new TextEncoder().encode(secretkey);

export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 365 * 1000);
    const session = await encrypt(userId, expiresAt);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    })
}

export async function deleteSession() {
    (await cookies()).delete("session")
}

export async function encrypt(userId, expiresAt) {
    const payload = {
        'userId': userId,
        'expiresAt': expiresAt
    }
    return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("365d").sign(encodedkey);
}

export async function decrypt(session) {
    if (!session || typeof session !== "string") {
        return null;
    }
    try {
        const { payload } = await jwtVerify(session, encodedkey, {
            algorithms: ["HS256"]
        });
        return payload;
    } catch (error) {
        console.log("Failed to verify session")
    }
}


export async function getCurrentUser() {
    const cookie = cookies();
    const session = (await cookie).get("session")?.value;
    const sessionData = await decrypt(session);
    return sessionData.userId
}
