import Navbar from "@/app/_components/layout/Navbar";
import Script from "next/script";

import { auth } from "@/app/_libs/auth";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";

// 🆕 Feature-Based BookingPage

// 🆕 Service داخل الـ Feature
import BookingPage from "@/app/_modules/flight/booking/components/template/BookingPage";
import { getCart } from "@/app/_modules/flight/booking/services/cartService";
// import BookingPage from "@/app/_components/flightComponents/bookingPage/BookingPage";

// ===============================
// Generate Metadata (SEO)
// ===============================
export async function generateMetadata({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/flights/booking",
        title: dict.FlightPage?.Booking?.metaTitle,
        description: dict.FlightPage?.Booking?.metaDescription,
        keywords: dict.FlightPage?.Booking?.metaKeywords,
    });
}

// ===============================
// PAGE COMPONENT
// ===============================
export default async function Page({ searchParams, params }) {
    const locale = params?.locale || DEFAULT_LOCALE;

    // FIX: لازم await
    const dict = await getDictionary(locale);

    // JSON-LD (Structured Data)
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/flights/booking",
        title: dict.FlightPage?.Booking?.metaTitle,
        description: dict.FlightPage?.Booking?.metaDescription,
        keywords: dict.FlightPage?.Booking?.metaKeywords,
    });

    // Search Params
    const sessionId = searchParams?.session_id;

    // Session
    const session = await auth();



    let cart = null;
    let error = null;

    // ===============================
    // FETCH CART (Service)
    // ===============================
    if (!sessionId) {
        error = "No session ID provided";
    } else {
        try {
            cart = await getCart(sessionId);
        } catch (err) {
            error = err.message;
        }
    }

    // ===============================
    // JSX OUTPUT
    // ===============================
    return (
        <>
            {/* JSON-LD SEO */}
            <Script
                id="flights-booking-jsonld"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Desktop Navbar */}
            <div className="hidden sm:block">
                <Navbar />
            </div>

            {/* Error State */}
            {error ? (
                <div className="p-4 text-red-600">Error: {error}</div>
            ) : (
                <BookingPage
                    isLogged={!!session?.user}
                    cart={cart}
                    sessionId={sessionId}
                    userId={session?.user?.id}
                    userType={session?.user?.usertype}
                />
            )}
        </>
    );
}
