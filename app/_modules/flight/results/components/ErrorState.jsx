"use client";

import NoFilteredFlightTickets from "./NoFilteredFlightTickets";

export default function ErrorState({ message, type, status }) {
    return (
        <div className="mt-5">
            <NoFilteredFlightTickets
                errorMessage={message}
                errorType={type}
                errorStatus={status}
            />
        </div>
    );
}
