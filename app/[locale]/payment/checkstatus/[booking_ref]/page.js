"use client";

import PaymentCheckStatus from "@/app/_modules/payment/checkstatus/components/organisms/PaymentCheckStatus";


export default function Page({ params, searchParams }) {
    return (
        <PaymentCheckStatus
            params={params}
            searchParams={searchParams}
        />
    );
}
