import Script from "next/script";
import { getFlightBookingDetails } from "@/app/_modules/flight/status/services/flightStatusService";
import FlightStatusPage from "@/app/_modules/flight/status/components/template/FlightStatusPage";
import LoadingState from "@/app/_components/status/LoadingState";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import Navbar from "@/app/_components/layout/Navbar";
import BottomAppBar from "@/app/_components/layout/bottomAppBar/BottomAppBar";

export async function generateMetadata({ params }) {
    const unwrappedParams = await Promise.resolve(params);
    const locale = unwrappedParams?.locale || DEFAULT_LOCALE;
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
    const unwrappedParams = await Promise.resolve(params);
    const unwrappedSearchParams = await Promise.resolve(searchParams);

    const locale = unwrappedParams?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/flights/status",
        title: dict.FlightPage?.Status?.metaTitle,
        description: dict.FlightPage?.Status?.metaDescription,
        keywords: dict.FlightPage?.Status?.metaKeywords,
    });

    const { status: routeStatus } = unwrappedParams;
    const status = routeStatus || unwrappedSearchParams.status || "failed";
    const moduleType = unwrappedSearchParams.module || "flight";
    const orderId = unwrappedSearchParams.order_id;
    const bookingRef = unwrappedSearchParams.booking_ref;
    const pnr = unwrappedSearchParams.PNR;

    const rawPending = String(unwrappedSearchParams?.pending ?? "").toLowerCase();
    const isPending =
        rawPending === "true" || rawPending === "1" || rawPending === "yes";

    const pageStatus =
        status === "success" ? (isPending ? "pending" : "success") : "failed";

    // Get payment info from URL params (passed from checkstatus)
    const paymentInfo = {
        gateway: unwrappedSearchParams.gateway,
        transaction_id: unwrappedSearchParams.transaction_id,
        amount: unwrappedSearchParams.amount,
        currency: unwrappedSearchParams.currency,
        status: unwrappedSearchParams.payment_status,
        card_type: unwrappedSearchParams.card_type,
        card_last4: unwrappedSearchParams.card_last4,
        transaction_date: unwrappedSearchParams.transaction_date,
    };

    let bookingData = null;
    if (moduleType === "flight" && bookingRef) {
        try {
            bookingData = await getFlightBookingDetails(bookingRef);
        } catch (err) {
            console.error(" Failed to fetch booking details:", err?.message);
        }
    }

    console.log(bookingData)

    return (
        <>
            <Script
                id="flights/status"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            {bookingData ? (
                <FlightStatusPage
                    bookingData={bookingData}
                    status={pageStatus}
                    bookingRef={bookingRef}
                    pnr={pnr}
                    paymentInfo={paymentInfo}
                />
            ) : (
                <LoadingState message="Fetching booking details..." />
            )}
            <BottomAppBar />
        </>
    );
}
