import { FlightSearchForm } from "../_components/flightSearchFormMobile/FlightSearchFormMobile";
// import { homeMetadata } from "../_libs/metadata";
import { useTranslations } from "next-intl";

// export const metadata = homeMetadata;

export const metadata = {
  title: "Welcome / Asfartrip.com",
  description:
    "Asfartrip.com is an online travel agency (OTA) that provides tourizm services such as (Flight ticket, Hotel bookings, Travel insurance, Car rentals & Holiday packages)",
};

function HomePage() {
  const t = useTranslations("Homepage");

  return (
    <section>
      <div className="w-full-main-colors">
        <div className="container-custom">
          <FlightSearchForm />
        </div>
      </div>
      <div className="container-custom ">{t("title")}</div>
    </section>
  );
}

export default HomePage;
