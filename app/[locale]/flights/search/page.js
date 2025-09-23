import FlightSearchNavWrapper from "@/app/_components/flightSearchNavWrapper/FlightSearchNavWrapper";
import { searchFlights } from "@/app/_libs/flightService";

async function Page({ searchParams }) {
    const searchObject = searchParams.searchObject
        ? JSON.parse(searchParams.searchObject)
        : {};

    const ticketResults = await searchFlights(searchObject);
    return (
        <>
            <FlightSearchNavWrapper tickets={ticketResults} />
            <section></section>
        </>
    );
}

export default Page;
