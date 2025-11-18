import LoadingState from "@/app/_components/status/LoadingState";
import { getFlightBookingDetails } from "@/app/_libs/flightService";
import StatusMatrix from "@/app/_components/status/StatusMatrix";

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
        path: "/flights/status",
        title: dict.FlightPage?.Status?.metaTitle,
        description: dict.FlightPage?.Status?.metaDescription,
        keywords: dict.FlightPage?.Status?.metaKeywords,
    });
}

export default async function StatusPage({ params, searchParams }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/flights/status",
        title: dict.FlightPage?.Status?.metaTitle,
        description: dict.FlightPage?.Status?.metaDescription,
        keywords: dict.FlightPage?.Status?.metaKeywords,
    });

    const { status: routeStatus } = await Promise.resolve(params);
    const status = routeStatus || searchParams.status || "failed";
    const moduleType = searchParams.module || "flight";
    const orderId = searchParams.order_id;

    const rawPending = String(searchParams?.pending ?? "").toLowerCase();
    const isPending =
        rawPending === "true" || rawPending === "1" || rawPending === "yes";

    const state =
        status === "success" ? (isPending ? "pending" : "success") : "failed";

    let bookingData = null;
    if (moduleType === "flight" && orderId) {
        try {
            bookingData = await getFlightBookingDetails(orderId);
        } catch (err) {
            console.error("❌ Failed to fetch booking details:", err?.message);
        }
    }

    const titles = {
        success: "Payment & Booking Confirmed",
        pending: "Payment Received – Ticket Issuance Pending",
        failed: "Payment Failed or Booking Rejected",
    };

    const subtitles = {
        success:
            "E-ticket issued successfully. Check your email & WhatsApp for details.",
        pending: "Payment successful — Ticket will be issued shortly.",
        failed: "The transaction couldn’t be completed. Please try again.",
    };

    return (
        <>
            <Script
                id="flights/status"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {bookingData ? (
                <StatusMatrix
                    state={state}
                    booking={bookingData}
                    title={titles[state]}
                    subtitle={subtitles[state]}
                />
            ) : (
                <LoadingState message="Fetching booking details..." />
            )}
        </>
    );
}
