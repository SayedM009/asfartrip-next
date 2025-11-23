"use client";
import { useEffect, useRef, useState } from "react";
import { fetchFlightsAPI } from "../services/fetchFlights";
import { validateResponse } from "../utils/validateResponse";

export default function useFlightSearch(parsedSearchObject) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        async function load() {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            setLoading(true); setError(null); setTickets([]);

            try {
                const response = await fetchFlightsAPI(parsedSearchObject, abortControllerRef.current.signal);
                if (!isMountedRef.current) return;

                const validation = validateResponse(response);
                if (validation.error) { setError(validation.error); setLoading(false); return; }

                setTickets(validation.data); setLoading(false);
            } catch (err) {
                if (!isMountedRef.current || err.name === "AbortError") return;
                setError({ message: err.message || "Network error", type: "NETWORK_ERROR" });
                setLoading(false);
            }
        }

        load();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [parsedSearchObject]);

    return { tickets, loading, error };
}
