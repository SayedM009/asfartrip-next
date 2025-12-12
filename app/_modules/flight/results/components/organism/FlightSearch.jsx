"use client";
import useFlightSearch from "../../hooks/useFlightSearch";
import ErrorState from "../molecule/ErrorState";
import ResultsWrapper from "./ResultsWrapper";
import FlightSearchSkeleton from "../Skeleton/FlightSearchSkeleton";

export default function FlightSearch({ parsedSearchObject, isDirect }) {
    const { tickets, loading, error } = useFlightSearch(parsedSearchObject);

    if (loading) return <FlightSearchSkeleton />;

    if (error)
        return (
            <ErrorState
                message={error.message}
                type={error.type}
                status={error.status}
            />
        );

    return <ResultsWrapper tickets={tickets} isDirect={isDirect} />;
}
