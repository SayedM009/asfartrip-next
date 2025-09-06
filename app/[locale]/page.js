import { FlightSearchForm } from "../_components/flightSearchFormMobile/FlightSearchFormMobile";
import { homeMetadata } from "../_libs/metadata";
import { useTranslations } from "next-intl";

export const metadata = homeMetadata;

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
