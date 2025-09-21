import { PromotionalSlider } from "@/app/_components/sliders/PromotionalSlider";
import { DestinationSlider } from "@/app/_components/sliders/DestinationSlider";
import { FlightsSlider } from "@/app/_components/sliders/FlightsSlider";
import { HotelsSlider } from "@/app/_components/sliders/HotelsSlider";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generateMetadataObj } from "@/app/_libs/metadata";

import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import FlightSearchWrapper from "@/app/_components/FlightSearchWrapper";
import BottomAppWrapper from "@/app/_components/bottomAppBar/BottomAppWrapper";

// generateMetadataObj:
// This function prepares metadata for any main page based on the selected language (locale).
// It uses the dictionary to get the page title and description.
// Returns an object ready to be used in Next.js generateMetadata.

export async function generateMetadata({ params }) {
    const locale = params.locale || "en";
    const dict = await getDictionary(locale);

    return generateMetadataObj({
        title: dict.Homepage.title,
        description: dict.Homepage.description,
        url: "https://www.asfartrip.com/",
        locale: locale || "en",
        image: "https://www.asfartrip.com/homepage/og-image.jpg",
    });
}

function HomePage() {
    return (
        <>
            <Navbar />
            <section>
                <ServicesNavigation />
                <FlightSearchWrapper />
                <PromotionalSlider />
                <FlightsSlider />
            </section>
            <BottomAppWrapper />
        </>
    );
}

export default HomePage;
