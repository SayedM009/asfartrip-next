"use client";

import TicketsCount from "./TicketsCount";
import NoFilteredFlightTickets from "./NoFilteredFlightTickets";
import FlightTicket from "./organism/FlightTicket";

export default function FlightTicketsList({
    filteredAndSortedFlights,
    filterBy,
    cheapestIndex,
    fastestIndex,
    resetFilters,
    searchObject,
}) {
    return (
        <>
            <TicketsCount filteredAndSortedFlights={filteredAndSortedFlights} />

            {!filteredAndSortedFlights ||
            filteredAndSortedFlights.length === 0 ? (
                <NoFilteredFlightTickets resetFilters={resetFilters} />
            ) : (
                filteredAndSortedFlights.map((flight, index) => (
                    <FlightTicket
                        key={`${filterBy}-flight-${index}`}
                        ticket={flight}
                        isCheapest={index === cheapestIndex}
                        isFastest={index === fastestIndex}
                        searchObject={searchObject}
                    />
                ))
            )}
        </>
    );
}
