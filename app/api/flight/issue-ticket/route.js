import { NextResponse } from "next/server";
import { flightService } from "@/app/_services/flight-service";

export async function POST(req) {
    const requestId = `ISSUE_TICKET_${Date.now()}`;
    try {
        const { booking_reference, transaction_id, payment_method } =
            await req.json();

        if (!booking_reference) throw new Error("Missing booking_reference");
        if (!transaction_id) throw new Error("Missing transaction_id");
        if (!payment_method) throw new Error("Missing payment_method");

        const data = await flightService.issueTicket(
            { booking_reference, transaction_id, payment_method },
            requestId
        );
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[${requestId}]`, err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
