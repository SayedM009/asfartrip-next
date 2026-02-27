import Travellers from "@/app/_modules/profile/features/travelers/components/organisms/Travellers";
import { getTranslations } from "next-intl/server";

async function Page() {
    const t = await getTranslations("Profile");
    return <>
        <h1 className="text-2xl font-bold mb-4">{t("travellers")}</h1>
        <Travellers />
    </>;
}

export default Page;
