import ActionsBar from "@/app/_components/status/ActionsBar";
import FlightSummary from "@/app/_components/status/FlightSummary";
import LoadingState from "@/app/_components/status/LoadingState";
import StatusHero from "@/app/_components/status/StatusHero";
import StatusHeroAI from "@/app/_components/status/StatusHeroAI";
import SummaryCard from "@/app/_components/status/SummaryCard";
import { getFlightBookingDetails } from "@/app/_libs/flightService";

import StatusMatrix from "@/app/_components/status/StatusMatrix";

export default async function StatusPage({ params, searchParams }) {
    // ✅ معالجة الـ params والـ query
    const { status: routeStatus } = await Promise.resolve(params);
    const status = routeStatus || searchParams.status || "failed";
    const moduleType = searchParams.module || "flight";
    const orderId = searchParams.order_id;
    const bookingRef = searchParams.booking_ref;

    // ✅ قراءة pending
    const rawPending = String(searchParams?.pending ?? "").toLowerCase();
    const isPending =
        rawPending === "true" || rawPending === "1" || rawPending === "yes";

    // ✅ تحديد الحالة العامة
    const state =
        status === "success" ? (isPending ? "pending" : "success") : "failed";

    // 🧾 جلب بيانات الحجز
    let bookingData = null;
    if (moduleType === "flight" && orderId) {
        try {
            bookingData = await getFlightBookingDetails(orderId);
        } catch (err) {
            console.error("❌ Failed to fetch booking details:", err?.message);
        }
    }

    // ✅ النصوص لكل حالة
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

    // ✅ العرض النهائي
    return (
        <>
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
