import BottomAppBar from "../_components/bottomAppBar/BottomAppBar";
import { FlightSearchForm } from "../_components/flightSearchFormMobile/FlightSearchFormMobile";
// import { homeMetadata } from "../_libs/metadata";
import { useTranslations } from "next-intl";
import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import MobileDetect from "mobile-detect";
import { headers } from "next/headers";

export const metadata = {
    title: "Welcome / Asfartrip.com",
    description:
        "Asfartrip.com is an online travel agency (OTA) that provides tourizm services such as (Flight ticket, Hotel bookings, Travel insurance, Car rentals & Holiday packages)",
};

function HomePage() {
    const t = useTranslations("Homepage");
    const ua = headers().get("user-agent") || "";
    const md = new MobileDetect(ua);

    return (
        <>
            <Navbar />
            <section className="container-custom">
                <ServicesNavigation />
                {md.mobile() ? <FlightSearchForm /> : null}
                <div>{t("title")}</div>
            </section>
            {md.mobile() && <BottomAppBar />}
        </>
    );
}

export default HomePage;

// <>
//     <section>
//         <div className="w-full-main-colors">
//             <div className="container-custom">
//                 <FlightSearchForm />
//             </div>
//         </div>
//         <div className="container-custom ">{t("title")}</div>
//     </section>
//     <BottomAppBar />
// </>
