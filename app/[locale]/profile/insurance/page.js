import InsuranceBookings from "@/app/_modules/profile/features/bookings/components/InsuranceBookings";
import { getTranslations } from "next-intl/server";

async function Page() {
    const t = await getTranslations("Profile");
    return <>
        <h1 className="text-2xl font-bold mb-4">{t("insurance")}</h1>
        <InsuranceBookings />
    </>;
}

export default Page;
