"use client";
import { FlightResults } from "../..";
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";

export default function ResultsWrapper({ tickets, isDirect }) {
    return (
        <>
            <FlightResults flights={tickets} isDirect={isDirect} />
            <TimeoutPopup
                timeoutMinutes={10}
                redirectLink={window.location.href}
            />
        </>
    );
}
