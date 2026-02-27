import HotelBookings from "@/app/_modules/profile/features/bookings/components/HotelBookings";
import { getTranslations } from "next-intl/server";

async function Page() {
    const t = await getTranslations("Profile");
    return <>
        <h1 className="text-2xl font-bold mb-4">{t("hotels")}</h1>
        <HotelBookings />
    </>;
}

export default Page;
