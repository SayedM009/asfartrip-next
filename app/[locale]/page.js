import { homeMetadata } from "../_libs/metadata";
import { useTranslations } from "next-intl";

export const metadata = homeMetadata;

function HomePage() {
  const t = useTranslations("Homepage");

  return <div>{t("title")}</div>;
}

export default HomePage;
