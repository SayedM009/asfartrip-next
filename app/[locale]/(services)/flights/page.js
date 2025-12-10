// Sliders
import FlightsSlider from "@/app/_modules/flight/presentation/components/organism/FlightsSlider";

// Components
import Navbar from "@/app/_components/layout/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import BottomAppBar from "@/app/_components/layout/bottomAppBar/BottomAppBar";
import { FlightSearchWrapper } from "@/app/_modules/flight/search";
import PromotionalSlider from "@/app/_modules/offers/components/organisms/PromotionalSlider";

export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/flights",
        title: dict.FlightPage.metaTitle,
        description: dict.FlightPage.metaDescription,
        keywords: dict.FlightPage.metaKeywords,
    });
}

async function HomePage({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/flights",
        title: dict.FlightPage?.metaTitle,
        description: dict.FlightPage?.metaDescription,
        keywords: dict.FlightPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="flights"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <section className="space-y-6 mb-10">
                <ServicesNavigation />
                <FlightSearchWrapper />
                <PromotionalSlider />
                <FlightsSlider />
            </section>
            <BottomAppBar />
        </>
    );
}

export default HomePage;
