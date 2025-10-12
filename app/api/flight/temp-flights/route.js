// app/api/flight/temp-flights/route.js
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { tempFlightStorage } from "@/app/_libs/tempFlightStorage";

export async function POST(req) {
    try {
        const body = await req.json();
        const { ticket, searchInfo } = body;

        if (!ticket) {
            return NextResponse.json(
                { error: "Missing ticket data" },
                { status: 400 }
            );
        }

        const id = randomUUID();
        tempFlightStorage.set(id, { ticket, searchInfo });

        console.log("✅ Ticket saved with ID:", id);

        return NextResponse.json({ success: true, temp_id: id });
    } catch (err) {
        console.error("❌ Error saving temp flight:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
