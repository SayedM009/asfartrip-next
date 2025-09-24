import MobileWrapper from "@/app/_components/flightSearchNavWrapper/MobileWrapper";
import { searchFlights } from "@/app/_libs/flightService";
import { Suspense } from "react";

async function Page({ searchParams }) {
    const searchObject = searchParams.searchObject
        ? JSON.parse(searchParams.searchObject)
        : {};

    const results = await searchFlights(searchObject);
    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <MobileWrapper tickets={results} />
            </Suspense>
            <section></section>
        </>
    );
}

export default Page;
