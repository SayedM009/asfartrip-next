import LoyaltyPoints from "@/app/_components/profile/LoyaltyPoints"
import LoyaltyTier from "@/app/_modules/profile/components/molecules/LoyaltyTier"
import Offers from "@/app/_modules/profile/components/molecules/Offers"
import { getTranslations } from "next-intl/server";


async function Page() {
    const t = await getTranslations("Profile");
    return <section className="grid-cols-3 gap-4 hidden md:grid ">
        <h1 className="col-span-3 text-2xl font-bold mb-4">{t("dashboard")}</h1>
        <LoyaltyTier />
        <LoyaltyPoints />
        <Offers />
    </section>
}



export default Page
