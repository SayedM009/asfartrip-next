import FlightBooking from "@/app/_components/flightBooking/FlightBooking";
import Navbar from "@/app/_components/Navbar";
import React from "react";

export default async function BookingPage({ searchParams }) {
    const { temp_id } = searchParams;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/flight/temp-flights/${temp_id}`,
        {
            cache: "no-store",
        }
    );
    const data = await res.json();

    console.log(data);

    if (!res.ok) {
        return <div>Ticket expired or not found</div>;
    }

    const { ticket, searchInfo } = data;

    return (
        <>
            <div className="hidden sm:block ">
                <Navbar />
            </div>
            <FlightBooking ticket={ticket} searchInfo={searchInfo} />
        </>
    );
}
