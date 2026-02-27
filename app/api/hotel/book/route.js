import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { cart_id, salutation, first_name, last_name, email, phone_number, address, country_code, guests } = body;

        if (!cart_id) {
            return NextResponse.json(
                { success: false, error: "cart_id is required" },
                { status: 400 }
            );
        }

        const payload = {
            cart_id,
            salutation,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            country_code,
        };

        if (guests) {
            payload.guests = typeof guests === "string" ? guests : JSON.stringify(guests);
        }

        const requestId = `bookhotel-${Date.now()}`;
        const result = await hotelService.bookHotel(payload, requestId);

        return NextResponse.json({ success: true, data: result?.response || result });
    } catch (error) {
        console.error("BookHotel API error:", error.message);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
