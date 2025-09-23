import Navbar from "@/app/_components/Navbar";
import { searchFlights } from "@/app/_libs/flightService";

async function Page({ searchParams }) {
    const searchObject = searchParams.searchObject
        ? JSON.parse(searchParams.searchObject)
        : {};

    const results = await searchFlights(searchObject);
    console.log(results);
    return (
        <>
            <Navbar />
            <section></section>
        </>
    );
}

export default Page;
