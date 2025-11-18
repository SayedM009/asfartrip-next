import FlightSearch from "@/app/_components/flightComponents/flightSearchNavWrapper/FlightSearch";
import FlightSearchNavWrapper from "@/app/_components/flightComponents/flightSearchNavWrapper/FlightSearchNavWrapper";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
export async function generateMetadata({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/flights/search",
        title: dict.FlightPage?.Search?.metaTitle,
        description: dict.FlightPage?.Search?.metaDescription,
        keywords: dict.FlightPage?.Search?.metaKeywords,
    });
}

async function Page({ searchParams, params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/flights/search",
        title: dict.FlightPage?.Search?.metaTitle,
        description: dict.FlightPage?.Search?.metaDescription,
        keywords: dict.FlightPage?.Search?.metaKeywords,
    });

    const parsedSearchObject = searchParams
        ? JSON.parse(searchParams.searchObject)
        : {};

    return (
        <>
            <Script
                id="flights/search"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FlightSearchNavWrapper />
            <FlightSearch parsedSearchObject={parsedSearchObject} />
        </>
    );
}

export default Page;
