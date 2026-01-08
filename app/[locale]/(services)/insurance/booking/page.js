import Navbar from "@/app/_components/navigation/Navbar";
import { auth } from "@/app/_libs/auth";
import { getDictionary } from "@/app/_libs/getDictionary";
import { buildWebPageJsonLd, generatePageMetadata } from "@/app/_libs/seo";
import BookingPage from "@/app/_modules/insurance/components/templates/BookingPage";
import { getCartAPI } from "@/app/_modules/insurance/service/getCartAPI";
import Script from "next/script";

export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/insurance/booking",
        title: dict.InsurancePage?.Booking.metaTitle,
        description: dict.InsurancePage?.Booking.metaDescription,
        keywords: dict.InsurancePage?.Booking.metaKeywords,
    });
}

async function page({ params, searchParams }) {
    const { session_id } = await searchParams;
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/insurance/booking",
        title: dict.InsurancePage?.Booking.metaTitle,
        description: dict.InsurancePage?.Booking.metaDescription,
        keywords: dict.InsurancePage?.Booking.metaKeywords,
    });

    const { data, error } = await getCartAPI(session_id);
    const session = await auth();

    return <div className="min-h-screen">
        <Script
            id="insurance/booking"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Desktop Navbar */}
        <div className="hidden md:block">
            <Navbar />
        </div>
        <BookingPage data={data} error={error} isLogged={!!session?.user}
            userId={session?.user?.id}
            userType={session?.user?.usertype} />
    </div>
}

export default page
