
// Sliders
import { DestinationSlider } from "../_components/sliders/DestinationSlider";
import FlightsSlider from "@/app/_modules/flight/presentation/components/organism/FlightsSlider";
import { HotelsSlider } from "../_components/sliders/HotelsSlider";

// Components
import Navbar from "@/app/_components/layout/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import { FlightSearchWrapper } from "../_modules/flight/search";
import BottomAppBar from "../_components/layout/bottomAppBar/BottomAppBar";
import PromotionalSlider from "../_modules/offers/components/organisms/PromotionalSlider";
import Footer from "../_components/layout/footer/Footer";

// Generate SEO
import Script from "next/script";
import { DEFAULT_LOCALE } from "../_config/i18n";
import { getDictionary } from "../_libs/getDictionary";
import { buildHomeJsonLd, generatePageMetadata } from "../_libs/seo";


export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/",
        title: dict.Homepage?.metaTitle,
        description: dict.Homepage?.metaDescription,
        keywords: dict.Homepage?.metaKeywords,
    });
}

export default async function HomePage({ params }) {
    const { locale } = await params;
    const jsonLd = buildHomeJsonLd({ locale: locale || DEFAULT_LOCALE });

    return (
        <section className="container-custom">
            <Script
                id="home-jsonld"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <section className="space-y-6 mb-10">
                <ServicesNavigation />
                <FlightSearchWrapper />
                <PromotionalSlider />
                <FlightsSlider />
                <DestinationSlider />
                <HotelsSlider />
            </section>
            <Footer />
            <BottomAppBar />
        </section>
    );
}
