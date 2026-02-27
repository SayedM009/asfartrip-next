import Navbar from "@/app/_components/navigation/Navbar";
import Script from "next/script";

import { auth } from "@/app/_libs/auth";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";

import HotelBookingPage from "@/app/_modules/hotels/booking/components/template/HotelBookingPage";

// ===============================
// Generate Metadata (SEO)
// ===============================
export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/hotels/booking",
        title: dict.Hotels?.booking?.metaTitle || "Hotel Booking",
        description: dict.Hotels?.booking?.metaDescription || "Complete your hotel reservation",
    });
}

// ===============================
// PAGE COMPONENT
// ===============================
export default async function Page({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    // JSON-LD
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/hotels/booking",
        title: dict.Hotels?.booking?.metaTitle || "Hotel Booking",
        description: dict.Hotels?.booking?.metaDescription || "Complete your hotel reservation",
    });

    // Session
    const session = await auth();

    return (
        <>
            <Script
                id="hotels-booking-jsonld"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="hidden md:block">
                <Navbar />
            </div>

            <HotelBookingPage
                isLogged={!!session?.user}
                userId={session?.user?.id}
                userType={session?.user?.usertype}
            />
        </>
    );
}
