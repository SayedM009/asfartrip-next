import { PromotionalSlider } from "@/app/_components/sliders/PromotionalSlider";
import { DestinationSlider } from "@/app/_components/sliders/DestinationSlider";
import { FlightsSlider } from "@/app/_components/sliders/FlightsSlider";
import { HotelsSlider } from "@/app/_components/sliders/HotelsSlider";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generateMetadataObj } from "@/app/_libs/metadata";

import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import FlightSearchWrapper from "@/app/_components/flightComponents/FlightSearchWrapper";
import BottomAppWrapper from "@/app/_components/bottomAppBar/BottomAppWrapper";

// generateMetadataObj:
// This function prepares metadata for any main page based on the selected language (locale).
// It uses the dictionary to get the page title and description.
// Returns an object ready to be used in Next.js generateMetadata.

export async function generateMetadata({ params }) {
    const locale = params.locale || "en";
    const dict = await getDictionary(locale);

    return generateMetadataObj({
        title: dict.FlightPage.title,
        description: dict.FlightPage.description,
        url: "https://www.asfartrip.com/flights",
        locale: locale || "en",
    });
}

function HomePage() {
    return (
        <>
            <Navbar />
            <section className="space-y-6">
                <ServicesNavigation />
                <FlightSearchWrapper />
                <PromotionalSlider />
                <FlightsSlider />
                {/* Giving More Space on Mobile */}
                <div className="h-6 sm:hidden" />
            </section>
            <BottomAppWrapper />
        </>
    );
}

export default HomePage;
