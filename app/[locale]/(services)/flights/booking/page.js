import BookingPage from "@/app/_components/flightComponents/bookingPage/BookingPage";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/app/_libs/auth";
import { getCart } from "@/app/_libs/flightService";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
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

export default async function Page({ searchParams, params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/flights/booking",
        title: dict.FlightPage?.Booking?.metaTitle,
        description: dict.FlightPage?.Booking?.metaDescription,
        keywords: dict.FlightPage?.Booking?.metaKeywords,
    });

    const { session_id: sessionId } = await searchParams;
    const session = await auth();

    let cart = null;
    let error = null;

    if (!sessionId) {
        error = "No session ID provided";
    } else {
        try {
            cart = await getCart(sessionId);
        } catch (err) {
            error = err.message + "test tes testset";
        }
    }

    return (
        <>
            <Script
                id="flights/booking"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="hidden sm:block">
                <Navbar />
            </div>
            {error ? (
                <div className="p-4 text-red-600">Error: {error}</div>
            ) : (
                <BookingPage
                    isLogged={!!session?.user}
                    cart={cart}
                    sessionId={sessionId}
                    userId={session?.user.id}
                />
            )}
        </>
    );
}
