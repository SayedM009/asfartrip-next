"use client";

import { ArrowDownWideNarrow, Funnel } from "lucide-react";
import { FlightResults } from "./FlightResults";

export default function MobileWrapper({ tickets }) {
    return (
        <>
            <section>
                <MobileFilters />
            </section>
            <section>
                {/* {tickets.map((ticket, index) => (
                    <FlightTicket key={index} ticket={ticket} />
                ))} */}
                <FlightResults flights={tickets} />
            </section>
        </>
    );
}

function MobileFilters() {
    return (
        <div className="fixed bottom-5 left-50 flex items-center translate-x-[-50%] gap-2  shadow py-1 px-3 rounded-3xl text-accent-500 bg-accent-50">
            <div className="flex items-center gap-2">
                <ArrowDownWideNarrow className="size-5" />
                <span>Sort</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-2">
                <Funnel className="size-5" />
                <span>Filter</span>
            </div>
        </div>
    );
}
