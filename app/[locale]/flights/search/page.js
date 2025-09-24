import FlightSearch from "@/app/_components/flightSearchNavWrapper/FlightSearch";
import FlightSearchNavWrapper from "@/app/_components/flightSearchNavWrapper/FlightSearchNavWrapper";

async function Page({ searchParams }) {
    const parsedSearchObject = searchParams
        ? JSON.parse(searchParams.searchObject)
        : {};
    return (
        <>
            <FlightSearchNavWrapper />
            <FlightSearch parsedSearchObject={parsedSearchObject} />
        </>
    );
}

export default Page;
