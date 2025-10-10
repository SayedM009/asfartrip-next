import { NextResponse } from "next/server";
import { getTempFlight } from "../route"; // بنستخدم الماب من نفس الملف

export async function GET(_, { params }) {
    const { id } = params;
    const ticket = getTempFlight(id);

    if (!ticket) {
        return NextResponse.json(
            { error: "Ticket not found or expired" },
            { status: 404 }
        );
    }

    return NextResponse.json({ ticket });
}
