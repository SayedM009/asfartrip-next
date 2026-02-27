import { getHotelBookingDetails } from "@/app/_modules/hotels/status/services/hotelStatusService";
import HotelStatusPage from "@/app/_modules/hotels/status/components/template/HotelStatusPage";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import Navbar from "@/app/_components/navigation/Navbar";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";

export async function generateMetadata({ params }) {
    const unwrappedParams = await Promise.resolve(params);
    const locale = unwrappedParams?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/hotels/status",
        title: dict.Hotels?.booking?.booking_status || "Hotel Booking Status",
        description: dict.Hotels?.booking?.booking_status_desc || "View your hotel booking details",
    });
}

export default async function HotelStatusPageRoute({ params, searchParams }) {
    const unwrappedParams = await Promise.resolve(params);
    const unwrappedSearchParams = await Promise.resolve(searchParams);

    const locale = unwrappedParams?.locale || DEFAULT_LOCALE;

    const { status: routeStatus } = unwrappedParams;
    const status = routeStatus || unwrappedSearchParams.status || "failed";

    const rawPending = String(unwrappedSearchParams?.pending ?? "").toLowerCase();
    const isPending = rawPending === "true" || rawPending === "1" || rawPending === "yes";

    const pageStatus = status === "success" ? (isPending ? "pending" : "success") : "failed";

    const bookingRef = unwrappedSearchParams.booking_ref || "";
    const pnrNo = unwrappedSearchParams.pnr_no || "";
    const bookingNo = unwrappedSearchParams.booking_no || "";

    // Payment info from URL params
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

    // Fetch booking details server-side
    // The external API expects pnr_no in AFT format (booking_ref), not numeric BookingPNR
    let bookingData = null;
    if (pnrNo || bookingNo || bookingRef) {
        try {
            const result = await getHotelBookingDetails(
                bookingRef || pnrNo,     // pnr_no: AFT format from booking_ref
                bookingNo || pnrNo       // booking_no: numeric BookingPNR
            );

            console.log(result)
            // API returns array - take the first booking
            bookingData = Array.isArray(result) ? result[0] : result;
        } catch (err) {
            console.error("Failed to fetch hotel booking details:", err?.message);
        }
    }

    return (
        <>
            <Navbar />
            <HotelStatusPage
                bookingData={bookingData}
                status={pageStatus}
                bookingRef={bookingRef}
                pnrNo={pnrNo || bookingData?.pnr_no || ""}
                bookingNo={bookingNo || bookingData?.booking_no || ""}
                paymentInfo={paymentInfo}
            />
            <BottomAppBar />
        </>
    );
}
