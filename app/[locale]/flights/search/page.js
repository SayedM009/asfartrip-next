import { getDictionary } from "@/app/_libs/getDictionary";
import { generateMetadataObj } from "@/app/_libs/metadata";
import FlightSearch from "@/app/_components/flightComponents/flightSearchNavWrapper/FlightSearch";
import FlightSearchNavWrapper from "@/app/_components/flightComponents/flightSearchNavWrapper/FlightSearchNavWrapper";

// generateMetadataObj:
// This function prepares metadata for any main page based on the selected language (locale).
// It uses the dictionary to get the page title and description.
// Returns an object ready to be used in Next.js generateMetadata.

export async function generateMetadata({ params }) {
    const locale = params.locale || "en";
    const dict = await getDictionary(locale);

    return generateMetadataObj({
        title: dict.FlightPage.Search.title,
        description: dict.FlightPage.Search.description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}flights`,
        locale: locale || "en",
    });
}

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
