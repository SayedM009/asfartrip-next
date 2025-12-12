"use client";

import TicketsCount from "../molecule/TicketsCount";
import NoFilteredFlightTickets from "../molecule/NoFilteredFlightTickets";
import FlightTicket from "./FlightTicket";

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
