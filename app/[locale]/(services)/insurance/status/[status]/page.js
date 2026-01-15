import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import Navbar from "@/app/_components/navigation/Navbar";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import InsuranceStatusPage from "@/app/_modules/insurance/components/templates/InsuranceStatusPage";

export async function generateMetadata({ params }) {
    const unwrappedParams = await Promise.resolve(params);
    const locale = unwrappedParams?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/insurance/status",
        title: dict.Insurance?.status?.metaTitle || "Insurance Status",
        description: dict.Insurance?.status?.metaDescription || "View your insurance booking status",
    });
}

export default async function StatusPage({ params, searchParams }) {
    const unwrappedParams = await Promise.resolve(params);
    const unwrappedSearchParams = await Promise.resolve(searchParams);

    const locale = unwrappedParams?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/insurance/status",
        title: dict.Insurance?.status?.metaTitle || "Insurance Status",
        description: dict.Insurance?.status?.metaDescription || "View your insurance booking status",
    });

    const { status: routeStatus } = unwrappedParams;
    const status = routeStatus || unwrappedSearchParams.status || "failed";
    const orderId = unwrappedSearchParams.order_id;
    const bookingRef = unwrappedSearchParams.booking_ref;
    const policyId = unwrappedSearchParams.policy_id;

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

    return (
        <>
            <Script
                id="insurance/status"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <InsuranceStatusPage
                status={pageStatus}
                orderId={orderId}
                bookingRef={bookingRef}
                policyId={policyId}
                paymentInfo={paymentInfo}
            />
            <BottomAppBar />
        </>
    );
}
