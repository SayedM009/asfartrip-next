import { useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { checkPayment } from "../services/checkPaymentService";
import { confirmBooking, issueTicket } from "../services/confirmBookingService";

/**
 * Hook for managing payment check flow
 * @param {Object} params
 * @param {string} params.booking_ref - Booking reference
 * @param {string} params.gateway - Payment gateway (TELR, ZIINA, etc.)
 * @param {string} params.order_ref - Telr order reference
 * @returns {Object} Payment check state and methods
 */
export function usePaymentCheck({ booking_ref, gateway, order_ref }) {
    const router = useRouter();
    const [status, setStatus] = useState("loading");
    const [statusMessage, setStatusMessage] = useState("Verifying your payment…");
    const [retryCount, setRetryCount] = useState(0);
    const [steps, setSteps] = useState([
        { label: "1. Payment Verified", status: "pending" },
        { label: "2. Booking Confirmed", status: "pending" },
        { label: "3. Ticket Issuance", status: "pending" },
    ]);

    const MAX_RETRIES = 2;

    const updateStep = useCallback((stepIndex, newStatus) => {
        setSteps((prev) =>
            prev.map((step, idx) =>
                idx === stepIndex ? { ...step, status: newStatus } : step
            )
        );
    }, []);

    const checkPaymentStatus = useCallback(async () => {
        if (!booking_ref) {
            setStatus("error");
            setStatusMessage("Missing booking reference.");
            updateStep(0, "error");
            return;
        }

        try {
            setStatus("loading");
            updateStep(0, "loading");
            setStatusMessage("Checking payment status…");

            // Step 1: Check payment
            const paymentData = await checkPayment(booking_ref, gateway, order_ref);

            const paymentSuccess =
                paymentData?.status?.toLowerCase() === "success" &&
                ["completed", "paid", "success"].includes(
                    (paymentData?.gateway_response?.status || "").toLowerCase()
                );

            const paymentFailed =
                paymentData?.order_status?.toLowerCase() === "failure" ||
                ["failed", "cancelled", "declined"].includes(
                    (paymentData?.gateway_response?.status || "").toLowerCase()
                );

            if (paymentFailed) {
                setStatus("error");
                updateStep(0, "error");
                setStatusMessage("Payment failed or cancelled.");
                return;
            }

            if (paymentSuccess) {
                updateStep(0, "success");
                setStatusMessage("Payment successful. Confirming the booking…");

                // Step 2: Confirm booking
                updateStep(1, "loading");

                try {
                    const confirmData = await confirmBooking(paymentData);
                    const bookingStatus = confirmData?.booking_status?.toUpperCase();

                    if (bookingStatus === "CONFIRMED") {
                        updateStep(1, "success");
                        setStatusMessage("Booking confirmed. Issuing ticket…");

                        // Step 3: Issue ticket
                        updateStep(2, "loading");

                        try {
                            console.log({ confirmData, paymentData });
                            const issueData = await issueTicket(confirmData, paymentData);

                            // Check ticket status from response
                            const ticketStatus = issueData?.data?.ticket_status?.toUpperCase();
                            const ticketNumbers = issueData?.data?.ticket_numbers;

                            // ✅ ONLY condition for success: ticket_status = CREATED AND ticket_numbers = Yes
                            if (ticketStatus === 'CREATED' && ticketNumbers === 'Yes') {
                                updateStep(2, "success");
                                setStatus("success");
                                setStatusMessage("Ticket issued successfully. Redirecting…");

                                // ✅ Send voucher to customer email (non-blocking)
                                try {
                                    const { sendVoucher } = await import('@/app/_libs/bookingService');
                                    sendVoucher(paymentData.booking_ref, 'FLIGHT').catch(err => {
                                        console.error('Failed to send voucher:', err);
                                        // Don't block user flow if voucher sending fails
                                    });
                                } catch (err) {
                                    console.error('Failed to import sendVoucher:', err);
                                }

                                setTimeout(() => {
                                    const paymentParams = new URLSearchParams({
                                        order_id: paymentData.order_id,
                                        booking_ref: paymentData.booking_ref,
                                        module: 'flight',
                                        PNR: confirmData.PNR || issueData?.data?.PNR || '',
                                        gateway: gateway || '',
                                        transaction_id: paymentData.gateway_response?.id || '',
                                        amount: paymentData.amount || paymentData.gateway_response?.amount || '',
                                        currency: paymentData.currency || paymentData.gateway_response?.currency || '',
                                        payment_status: paymentData.payment_status,
                                        card_type: paymentData.card_type || '',
                                        card_last4: paymentData.card_last4 || '',
                                        transaction_date: paymentData.transaction_date || ''
                                    });
                                    router.push(`/flights/status/success?${paymentParams.toString()}`);
                                }, 1500);
                                return;
                            }

                            // ✅ If ticket was already issued (from alreadyIssued flag)
                            if (issueData?.alreadyIssued) {
                                updateStep(2, "success");
                                setStatus("success");
                                setStatusMessage("Your ticket is already issued. Redirecting…");

                                // ✅ Send voucher to customer email (non-blocking)
                                try {
                                    const { sendVoucher } = await import('@/app/_libs/bookingService');
                                    sendVoucher(paymentData.booking_ref, 'FLIGHT').catch(err => {
                                        console.error('Failed to send voucher:', err);
                                    });
                                } catch (err) {
                                    console.error('Failed to import sendVoucher:', err);
                                }

                                setTimeout(() => {
                                    const paymentParams = new URLSearchParams({
                                        order_id: paymentData.order_id,
                                        booking_ref: paymentData.booking_ref,
                                        module: 'flight',
                                        PNR: confirmData.PNR || '',
                                        gateway: gateway || '',
                                        transaction_id: paymentData.gateway_response?.id || '',
                                        amount: paymentData.amount || paymentData.gateway_response?.amount || '',
                                        currency: paymentData.currency || paymentData.gateway_response?.currency || '',
                                        payment_status: paymentData.payment_status,
                                        card_type: paymentData.card_type || '',
                                        card_last4: paymentData.card_last4 || '',
                                        transaction_date: paymentData.transaction_date || ''
                                    });
                                    router.push(`/flights/status/success?${paymentParams.toString()}`);
                                }, 1500);
                                return;
                            }

                            // ⏳ ANY other case - ticket is pending (PENDING, FAILURE, or any other status)
                            updateStep(2, "success");
                            setStatus("partial-success");
                            setStatusMessage(
                                "Payment received successfully. Your ticket will be issued within 3 hours."
                            );

                            setTimeout(() => {
                                const paymentParams = new URLSearchParams({
                                    order_id: paymentData.order_id,
                                    booking_ref: paymentData.booking_ref,
                                    pending: 'true',
                                    module: 'flight',
                                    PNR: confirmData.PNR || '',
                                    gateway: gateway || '',
                                    transaction_id: paymentData.gateway_response?.id || '',
                                    amount: paymentData.amount || paymentData.gateway_response?.amount || '',
                                    currency: paymentData.currency || paymentData.gateway_response?.currency || '',
                                    payment_status: paymentData.payment_status,
                                    card_type: paymentData.card_type || '',
                                    card_last4: paymentData.card_last4 || '',
                                    transaction_date: paymentData.transaction_date || ''
                                });
                                router.push(`/flights/status/success?${paymentParams.toString()}`);
                            }, 3000);
                            return;
                        } catch (issueErr) {
                            // Ticket issuance failed but booking is confirmed
                            console.error("Issue ticket error:", issueErr);
                            updateStep(2, "success");
                            setStatus("partial-success");
                            setStatusMessage(
                                "Payment received successfully. Your ticket will be issued within 3 hours."
                            );

                            setTimeout(() => {
                                const paymentParams = new URLSearchParams({
                                    order_id: paymentData.order_id,
                                    booking_ref: paymentData.booking_ref,
                                    pending: 'true',
                                    module: 'flight',
                                    PNR: confirmData.PNR || '',
                                    gateway: gateway || '',
                                    transaction_id: paymentData.gateway_response?.id || '',
                                    amount: paymentData.amount || paymentData.gateway_response?.amount || '',
                                    currency: paymentData.currency || paymentData.gateway_response?.currency || '',
                                    payment_status: paymentData.payment_status,
                                    card_type: paymentData.card_type || '',
                                    card_last4: paymentData.card_last4 || '',
                                    transaction_date: paymentData.transaction_date || ''
                                });
                                router.push(`/flights/status/success?${paymentParams.toString()}`);
                            }, 3000);
                            return;
                        }
                    }

                    // Booking is pending or processing
                    if (["PENDING", "PROCESSING"].includes(bookingStatus)) {
                        updateStep(1, "success");
                        updateStep(2, "success");
                        setStatus("partial-success");
                        setStatusMessage(
                            "Payment received successfully. Your ticket will be issued within 3 hours."
                        );

                        setTimeout(() => {
                            const paymentParams = new URLSearchParams({
                                order_id: paymentData.order_id,
                                booking_ref: paymentData.booking_ref,
                                pending: 'true',
                                module: 'flight',
                                gateway: gateway || '',
                                transaction_id: paymentData.gateway_response?.id || '',
                                amount: paymentData.amount || paymentData.gateway_response?.amount || '',
                                currency: paymentData.currency || paymentData.gateway_response?.currency || '',
                                payment_status: 'completed'
                            });
                            router.push(`/flights/status/success?${paymentParams.toString()}`);
                        }, 3000);
                        return;
                    }

                    // Other booking statuses - treat as partial success
                    updateStep(1, "success");
                    updateStep(2, "success");
                    setStatus("partial-success");
                    setStatusMessage(
                        "Payment received successfully. Your ticket will be issued within 3 hours."
                    );

                    setTimeout(() => {
                        router.push(
                            `/flights/status/success?order_id=${paymentData.order_id}&booking_ref=${paymentData.booking_ref}&pending=true&module=flight`
                        );
                    }, 3000);
                    return;
                } catch (confirmErr) {
                    // Booking confirmation failed but payment succeeded
                    updateStep(1, "success");
                    updateStep(2, "success");
                    setStatus("partial-success");
                    setStatusMessage(
                        "Payment received successfully. Your ticket will be issued within 3 hours."
                    );

                    setTimeout(() => {
                        router.push(
                            `/flights/status/success?order_id=${paymentData.order_id}&booking_ref=${paymentData.booking_ref}&pending=true&module=flight`
                        );
                    }, 3000);
                    return;
                }
            }

            // Payment status unclear - retry
            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `Rechecking payment status... (Retry ${retryCount + 1})`
                );
                setTimeout(
                    () => setRetryCount((n) => n + 1),
                    1600 + retryCount * 600
                );
                return;
            }

            setStatus("error");
            updateStep(0, "error");
            setStatusMessage("Unable to determine payment status.");
        } catch (err) {
            console.error("Payment check error:", err);

            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `Network issue. Retrying (${retryCount + 1}/${MAX_RETRIES})…`
                );
                setTimeout(() => setRetryCount((n) => n + 1), 1800);
                return;
            }

            setStatus("error");
            updateStep(0, "error");
            setStatusMessage("Network error. Please try again.");
        }
    }, [booking_ref, gateway, order_ref, retryCount, router, updateStep]);

    const retry = useCallback(() => {
        setRetryCount(0);
        setStatus("loading");
        setSteps([
            { label: "1. Payment Verified", status: "pending" },
            { label: "2. Booking Confirmed", status: "pending" },
            { label: "3. Ticket Issuance", status: "pending" },
        ]);
    }, []);

    return {
        status,
        statusMessage,
        steps,
        checkPaymentStatus,
        retry,
    };
}
