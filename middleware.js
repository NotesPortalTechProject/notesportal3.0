import { cookies } from "next/headers";
import { decrypt } from "./lib/session";
import { NextResponse } from "next/server";
import { supabase } from "./lib/supabaseClient";

const publicRoutes = ["/", "/signup", "/login", "/login/with-otp"]
export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path)
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie)
    const baseUrl = 'http://localhost:3000'

    if (path.startsWith("/api/sendOtpMail")) {
        return NextResponse.next();
    }

    if (!isPublicRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl))
    }

    if (isPublicRoute && session?.userId) {
        const now = new Date().toISOString(); 
        await supabase.from("users").update({"lastactive":now}).eq("id",session.userId);
        return NextResponse.redirect(new URL(`/home`, req.nextUrl));
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};