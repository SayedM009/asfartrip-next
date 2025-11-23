// app/_modules/flights/results/filters/hooks/useFlightFilterLogic.js
"use client";

import { useMemo, useEffect, useState } from "react";
import { useLocale } from "next-intl";

// Utils
import { getPriceRange } from "../utils/getPriceRange";
import { getAirlines } from "../utils/getAirlines";
import { getAirports } from "../utils/getAirports";
import { getStops } from "../utils/getStops";
import {
    getFlightDurationHours,
    getTotalDuration,
} from "../utils/getDurations";
import { fetchAirportName } from "../utils/fetchAirportNames";

export function useFlightFilterLogic(flights) {
    const locale = useLocale();
    const [showAllAirlines, setShowAllAirlines] = useState(false);
    const [showAllAirports, setShowAllAirports] = useState(false);
    const [airportsWithNames, setAirportsWithNames] = useState([]);

    // =======================
    // Price Range
    // =======================
    const priceRange = useMemo(() => getPriceRange(flights), [flights]);

    // =======================
    // Duration Range
    // =======================
    const durationRange = useMemo(() => {
        if (!flights || flights.length === 0) return { min: 0, max: 48 };

        const durations = flights.map(getFlightDurationHours);
        return {
            min: Math.floor(Math.min(...durations)),
            max: Math.ceil(Math.max(...durations)),
        };
    }, [flights]);

    // =======================
    // Stops Count
    // =======================
    const stopsCount = useMemo(() => {
        let nonStop = 0,
            oneStop = 0,
            twoStops = 0,
            moreThanTwo = 0;

        flights.forEach((f) => {
            const stops = getStops(f);
            if (stops === 0) nonStop++;
            else if (stops === 1) oneStop++;
            else if (stops === 2) twoStops++;
            else if (stops > 2) moreThanTwo++;
        });

        return { nonStop, oneStop, twoStops, moreThanTwo };
    }, [flights]);

    // =======================
    // Fare Type
    // =======================
    const fareTypeCount = useMemo(() => {
        let refundable = 0,
            nonRefundable = 0;

        flights.forEach((f) => {
            if (f.Refundable === "true") refundable++;
            else nonRefundable++;
        });

        return { refundable, nonRefundable };
    }, [flights]);

    // =======================
    // Airlines
    // =======================
    const airlines = useMemo(() => getAirlines(flights), [flights]);

    // =======================
    // Stopover Airports
    // =======================
    // useMemo(() => getAirports(flights), [flights]); // Removed redundant call
    const airports = useMemo(() => getAirports(flights), [flights]);

    // =======================
    // Fetch airport names
    // =======================
    useEffect(() => {
        async function loadNames() {
            if (!airports.length) return;

            const result = await Promise.all(
                airports.map(async ([code, count]) => {
                    const name = await fetchAirportName(code, locale);
                    return { code, name, count };
                })
            );

            setAirportsWithNames(result);
        }

        loadNames();
    }, [airports, locale]);

    return {
        // UI states
        showAllAirlines,
        setShowAllAirlines,
        showAllAirports,
        setShowAllAirports,

        // Data
        priceRange,
        durationRange,
        stopsCount,
        fareTypeCount,
        airlines,
        airports,
        airportsWithNames,
    };
}
