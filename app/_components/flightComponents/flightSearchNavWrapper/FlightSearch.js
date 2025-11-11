"use client";

import { useState, useEffect, useRef } from "react";
import { FlightResults, NoFlightTickets } from "./FlightResults";
import TimeoutPopup from "../../ui/TimeoutPopup";

export default function FlightSearch({ parsedSearchObject }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    // Use ref to track if component is mounted
    const isMountedRef = useRef(true);

    useEffect(() => {
        // Mark component as mounted
        isMountedRef.current = true;

        async function fetchFlights() {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller for this request
            abortControllerRef.current = new AbortController();

            // Reset state
            setLoading(true);
            setError(null);
            setTickets([]);

            try {
                const response = await fetch("/api/flight/search-flights", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(parsedSearchObject),
                    signal: abortControllerRef.current.signal,
                });

                // Check if component is still mounted before updating state
                if (!isMountedRef.current) {
                    return;
                }

                // Parse response
                const data = await response.json();

                // Handle error response
                if (!response.ok || data?.error) {
                    const errorMsg =
                        data?.error || `Server error (${response.status})`;
                    console.error(
                        `❌ [${new Date().toISOString()}] API Error:`,
                        errorMsg
                    );

                    setError({
                        message: errorMsg,
                        status: data?.status || response.status,
                        requestId: data?.requestId,
                        type: "API_ERROR",
                    });
                    setTickets([]);
                    setLoading(false);
                    return;
                }

                // Validate response structure
                if (!data) {
                    console.warn(
                        `⚠️ [${new Date().toISOString()}] Invalid response: null or undefined`
                    );
                    setError({
                        message: "Invalid response from server",
                        type: "INVALID_RESPONSE",
                    });
                    setTickets([]);
                    setLoading(false);
                    return;
                }

                // Handle non-array response
                if (!Array.isArray(data)) {
                    console.warn(
                        `⚠️ [${new Date().toISOString()}] Invalid response: not an array`,
                        typeof data
                    );
                    setError({
                        message: "Unexpected response format from server",
                        type: "INVALID_RESPONSE",
                    });
                    setTickets([]);
                    setLoading(false);
                    return;
                }

                // Handle empty results
                if (data.length === 0) {
                    setError({
                        message:
                            "No flights available for your search criteria. Try different dates or destinations.",
                        type: "NO_RESULTS",
                    });
                    setTickets([]);
                    setLoading(false);
                    return;
                }

                // Success - we have results
                setTickets(data);
                setError(null);
                setLoading(false);
            } catch (err) {
                // Don't update state if component unmounted
                if (!isMountedRef.current) {
                    return;
                }

                // ✅ Ignore aborted requests
                if (err.name === "AbortError") {
                    console.log("🔁 Request aborted safely (ignored)");
                    return;
                }

                console.error(
                    `❌ [${new Date().toISOString()}] Fetch error:`,
                    err
                );

                let errorMessage =
                    "Failed to search flights. Please check your connection and try again.";
                let errorType = "NETWORK_ERROR";

                if (err.message.includes("fetch")) {
                    errorMessage =
                        "Network error. Please check your internet connection.";
                    errorType = "CONNECTION_ERROR";
                } else if (err.message) {
                    errorMessage = err.message;
                }

                setError({
                    message: errorMessage,
                    type: errorType,
                });
                setTickets([]);
                setLoading(false);
            }
        }

        // Start fetch
        fetchFlights();

        // Cleanup function
        return () => {
            // Mark component as unmounted
            isMountedRef.current = false;

            // Abort ongoing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [parsedSearchObject]); // Re-run when search params change

    // Show loading skeleton
    if (loading) {
        return <FlightSearchSkeleton />;
    }

    // Show error or no results
    if (error) {
        return (
            <div className="mt-5">
                <NoFlightTickets
                    errorMessage={error.message}
                    errorType={error.type}
                    errorStatus={error.status}
                    requestId={error.requestId}
                />
            </div>
        );
    }

    // Show results
    if (tickets.length > 0) {
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

    // Fallback: show empty state (shouldn't reach here normally)
    return (
        <div className="mt-5">
            <NoFlightTickets />
        </div>
    );
}

// Skeleton Components (unchanged but included for completeness)
export function FlightSearchSkeleton() {
    return (
        <div className="mt-5">
            <div className="grid grid-cols-12 gap-4">
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
        <div className="animate-pulse rounded-xl p-4 flex flex-col mb-4 shadow-lg dark:shadow-gray-700">
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
        <div className="animate-pulse p-4 rounded-xl shadow-lg dark:shadow-gray-700 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Stops Section */}
            <div className="mb-6">
                <div className="h-5 w-20 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Fare Type Section */}
            <div className="mb-6">
                <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Airlines Section */}
            <div className="mb-6">
                <div className="h-5 w-20 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <div className="h-5 w-28 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* Duration Range */}
            <div className="mb-6">
                <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* Stopover Range */}
            <div>
                <div className="h-5 w-36 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

function TabSkeleton() {
    return (
        <div className="animate-pulse flex items-center justify-around gap-2 mb-4 md:hidden shadow p-2 rounded-xl ">
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
    );
}
