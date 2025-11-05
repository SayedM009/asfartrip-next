import { PromotionalSlider } from "../_components/sliders/PromotionalSlider";
import { DestinationSlider } from "../_components/sliders/DestinationSlider";
import { FlightsSlider } from "../_components/sliders/FlightsSlider";
import { HotelsSlider } from "../_components/sliders/HotelsSlider";
import { getDictionary } from "../_libs/getDictionary";
import { generateMetadataObj } from "../_libs/metadata";

import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import FlightSearchWrapper from "../_components/flightComponents/FlightSearchWrapper";
import BottomAppWrapper from "../_components/bottomAppBar/BottomAppWrapper";
import { Footer } from "../_components/Footer";

// generateMetadataObj:
// This function prepares metadata for any main page based on the selected language (locale).
// It uses the dictionary to get the page title and description.
// Returns an object ready to be used in Next.js generateMetadata.

export async function generateMetadata({ params }) {
    const locale = (await params).locale || "en";
    const dict = await getDictionary(locale);

    return generateMetadataObj({
        title: dict.Homepage.title,
        description: dict.Homepage.description,
        url: "https://www.asfartrip.com/",
        locale: locale || "en",
    });
}

function HomePage() {
    return (
        <section className="container-custom">
            <Navbar />
            <section className="space-y-6">
                <ServicesNavigation />
                <FlightSearchWrapper />
                <PromotionalSlider />
                <DestinationSlider />
                <FlightsSlider />
                <HotelsSlider />
                {/* Giving More Space on Mobile */}
                <div className="h-6 sm:hidden" />
            </section>
            <Footer />
            <BottomAppWrapper />
        </section>
    );
}

export default HomePage;
