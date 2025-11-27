"use client";

import { use } from "react";
import PaymentCheckStatus from "@/app/_modules/payment/checkstatus/components/organisms/PaymentCheckStatus";

/**
 * Payment Callback Page
 * Handles payment verification for both Telr and external gateways
 * 
 * URL Examples:
 * - Telr: /en/payment/checkstatus/AFT11F...?gateway=telr&order_ref=C135163E...
 * - External: /en/payment/checkstatus/AFT11F...?gateway=ziina
 */
export default function Page({ params, searchParams }) {
    const unwrappedParams = use(params);
    const unwrappedSearchParams = use(searchParams);

    return (
        <PaymentCheckStatus
            params={unwrappedParams}
            searchParams={unwrappedSearchParams}
        />
    );
}
