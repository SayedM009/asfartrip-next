"use client";
import { FlightDetailsDialog } from "@/app/_components/flightSearchNavWrapper/FlightDetailsDialog";
import { useState } from "react";

function FlightBooking({ ticket }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    return (
        <FlightDetailsDialog
            ticket={ticket}
            isOpen={showDetailsDialog}
            onClose={() => setShowDetailsDialog(!showDetailsDialog)}
            withContinue={false}
        />
    );
}

export default FlightBooking;
