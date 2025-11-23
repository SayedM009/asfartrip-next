"use client";
import { FlightResults } from "..";
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";

export default function ResultsWrapper({ tickets }) {
    return (
        <>
            <FlightResults flights={tickets} />
            <TimeoutPopup
                timeoutMinutes={10}
                redirectLink={window.location.href}
            />
        </>
    );
}
