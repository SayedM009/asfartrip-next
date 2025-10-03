import { searchFlights } from "@/app/_libs/flightService";
import { FlightResults, NoFlightTickets } from "./FlightResults";

export default async function FlightSearch({ parsedSearchObject }) {
    const tickets = await searchFlights(parsedSearchObject);
    if (!tickets || !tickets.length)
        return (
            <div className="mt-5">
                <NoFlightTickets />
            </div>
        );
    return <FlightResults flights={tickets} />;
}
