import { cookies } from "next/headers";

export async function POST(req) {
    const { token } = await req.json();
    if (!token) {
        return new Response(JSON.stringify({ error: "No token provided" }), {
            status: 400,
        });
    }

    // تخزين الكوكي
    cookies().set("api_token", token, {
        httpOnly: true, // علشان الأمان
        // secure: true, // مطلوب في HTTPS
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60, // التوكين صالح ساعة مثلا
    });

    return Response.json({ success: true });
}
