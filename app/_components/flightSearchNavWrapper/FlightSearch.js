// import { searchFlights } from "@/app/_libs/flightService";
// import { FlightResults, NoFlightTickets } from "./FlightResults";

// export default async function FlightSearch({ parsedSearchObject }) {
//     const tickets = await searchFlights(parsedSearchObject);
//     if (!tickets || !tickets.length)
//         return (
//             <div className="mt-5">
//                 <NoFlightTickets />
//             </div>
//         );
//     return <FlightResults flights={tickets} />;
// }

"use client";

import { useState, useEffect } from "react";
import { FlightResults, NoFlightTickets } from "./FlightResults";

export default function FlightSearch({ parsedSearchObject }) {
    const [tickets, setTickets] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch("/api/search-flights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parsedSearchObject),
                });

                const data = await res.json();
                setTickets(data);
            } catch (err) {
                console.error(err);
                setTickets([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [parsedSearchObject]); // كل مرة الباراميترات تتغير، يعمل بحث جديد

    if (loading) return <FlightSearchSkeleton />;

    if (!tickets || !tickets.length)
        return (
            <div className="mt-5">
                <NoFlightTickets />
            </div>
        );

    return <FlightResults flights={tickets} />;
}
export function FlightSearchSkeleton() {
    return (
        <div className="mt-5">
            <div className="grid grid-cols-12  gap-4">
                <div className="hidden md:block md:col-span-3">
                    <FliterSkeleton />
                </div>
                <div className="col-span-12 md:col-span-9 space-y-4">
                    <TabSkeleton />
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <TicketSkeleton key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TicketSkeleton() {
    return (
        <div className="animate-pulse  rounded-xl p-4 flex flex-col mb-4 shadow-sm">
            {/* Departure */}
            <div className="flex justify-between mb-4">
                <div className="flex flex-col items-start">
                    <div className="h-5 w-16 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-10 bg-gray-200 rounded mb-1"></div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="h-5 w-16 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                </div>
            </div>

            {/* Airline & Price */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col">
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="h-3 w-14 bg-gray-200 rounded mb-1"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded hidden md:block"></div>
                </div>
            </div>
        </div>
    );
}

function FliterSkeleton() {
    return (
        <div className="animate-pulse p-4 rounded-xl shadow-sm w-full min-h-200">
            {/* Showing results & Clear Button */}
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            </div>
            {/* Stops */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center gap-2 ">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            </div>

            {/* Fare Type */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center gap-2 ">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            </div>

            {/* Airlines */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center gap-2 ">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="flex items-center gap-2 ">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="flex items-center gap-2 ">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="flex items-center gap-2 ">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
            </div>

            {/* Price Range */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded-full mb-2"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full mb-2"></div>
            </div>
            {/* Duration Range */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded-full mb-2"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full mb-2"></div>
            </div>
            {/* Stopover Range */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded-full mb-2"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full mb-2"></div>
            </div>
        </div>
    );
}

function TabSkeleton() {
    return (
        <div className="animate-pulse flex items-center justify-around space-x-4  mb-4 md:hidden shadow p-2 rounded-xl">
            <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
        </div>
    );
}
