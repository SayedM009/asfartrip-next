import BottomAppBar from "../_components/bottomAppBar/BottomAppBar";
// import { homeMetadata } from "../_libs/metadata";
import { useTranslations } from "next-intl";
import { PromotionalSlider } from "../_components/sliders/PromotionalSlider";
import { DestinationSlider } from "../_components/sliders/DestinationSlider";
import { FlightsSlider } from "../_components/sliders/FlightsSlider";
import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import useIsDevice from "../_hooks/useIsDevice";
import FlightSearchWrapper from "../_components/FlightSearchWrapper";

export const metadata = {
    title: "Welcome / Asfartrip.com",
    description:
        "Asfartrip.com is an online travel agency (OTA) that provides tourizm services such as (Flight ticket, Hotel bookings, Travel insurance, Car rentals & Holiday packages)",
};

function HomePage() {
    const t = useTranslations("Homepage");
    const { mobile } = useIsDevice();

    return (
        <>
            <Navbar />
            <section className="">
                <ServicesNavigation />
                <FlightSearchWrapper />
                <PromotionalSlider />
                <DestinationSlider />
                <FlightsSlider />
            </section>
            {mobile && <BottomAppBar />}
        </>
    );
}

export default HomePage;
