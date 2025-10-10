import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// تخزين مؤقت في الذاكرة (reset عند restart السيرفر)
const tempFlights = new Map();

export async function POST(req) {
    try {
        const body = await req.json();
        const { ticket } = body;

        if (!ticket) {
            return NextResponse.json(
                { error: "Missing ticket data" },
                { status: 400 }
            );
        }

        const id = randomUUID();
        tempFlights.set(id, {
            ...ticket,
            createdAt: Date.now(),
        });

        // نحذف بعد 10 دقايق (بيانات مؤقتة)
        setTimeout(() => {
            tempFlights.delete(id);
        }, 10 * 60 * 1000);

        return NextResponse.json({ success: true, temp_id: id });
    } catch (err) {
        console.error("Error saving temp flight:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// للتجربة فقط (اختياري)
export function GET() {
    return NextResponse.json({ stored: Array.from(tempFlights.keys()) });
}

// Export getter function (عشان نستخدمها في route تاني)
export function getTempFlight(id) {
    return tempFlights.get(id);
}
