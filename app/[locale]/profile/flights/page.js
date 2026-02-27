import FlightBookings from "@/app/_modules/profile/features/bookings/components/FlightBookings";
import { getTranslations } from "next-intl/server";

async function Page() {
    const t = await getTranslations("Profile");
    return <>
        <h1 className="text-2xl font-bold mb-4">{t("flights")}</h1>
        <FlightBookings />
    </>;
}

export default Page;
