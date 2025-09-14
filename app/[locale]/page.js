import BottomAppBar from "../_components/bottomAppBar/BottomAppBar";
import { FlightSearchForm } from "../_components/flightSearchFormMobile/FlightSearchFormMobile";
// import { homeMetadata } from "../_libs/metadata";
import { useTranslations } from "next-intl";
import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import useIsDevice from "../_hooks/useIsDevice";

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
            <section>
                <ServicesNavigation />
                {mobile ? <FlightSearchForm /> : null}
                <div>{t("title")}</div>
            </section>
            {mobile && <BottomAppBar />}
        </>
    );
}

export default HomePage;
