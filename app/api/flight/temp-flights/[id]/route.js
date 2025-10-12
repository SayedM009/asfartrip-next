// app/api/flight/temp-flights/[id]/route.js
import { tempFlightStorage } from "@/app/_libs/tempFlightStorage";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = params;

        console.log("🔍 Looking for ticket ID:", id);

        const found = tempFlightStorage.get(id);

        if (!found) {
            console.log("❌ Ticket not found or expired");
            return NextResponse.json(
                { error: "Ticket not found or expired" },
                { status: 404 }
            );
        }

        console.log("✅ Ticket found:", id);
        return NextResponse.json(found);
    } catch (err) {
        console.error("❌ Error fetching temp flight:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
