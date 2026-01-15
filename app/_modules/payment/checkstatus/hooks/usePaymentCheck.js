import { useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { checkPayment } from "../services/checkPaymentService";
import { confirmBooking, issueTicket } from "../services/confirmBookingService";
import { buildStatusRedirectUrl, buildRedirectUrlString } from "../utils/redirectHelper";
import { getModuleConfig } from "../registry/moduleRegistry";

export function usePaymentCheck({ booking_ref, gateway, order_ref, module: moduleFromUrl }) {
    const router = useRouter();
    const t = useTranslations("PaymentPage");
    const [status, setStatus] = useState("loading");
    const [statusMessage, setStatusMessage] = useState(t("verifyingPayment"));
    const [retryCount, setRetryCount] = useState(0);
    const [steps, setSteps] = useState([
        { label: t("stepPaymentVerified"), status: "pending" },
        { label: t("stepBookingConfirmed"), status: "pending" },
        { label: t("stepTicketIssuance"), status: "pending" },
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
            setStatusMessage(t("missingBookingRef"));
            updateStep(0, "error");
            return;
        }

        try {
            setStatus("loading");
            updateStep(0, "loading");
            setStatusMessage(t("checkingPaymentStatus"));

            // Step 1: Check payment
            const paymentData = await checkPayment(booking_ref, gateway, order_ref);

            // Override module from URL if provided (for Insurance flow)
            if (moduleFromUrl) {
                paymentData.module = moduleFromUrl;
            }

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
                setStatusMessage(t("paymentFailedCancelled"));
                return;
            }

            if (paymentSuccess) {
                updateStep(0, "success");
                setStatusMessage(t("paymentSuccessConfirming"));

                // Step 2: Confirm booking
                updateStep(1, "loading");

                try {
                    const confirmData = await confirmBooking(paymentData);
                    const bookingStatus = confirmData?.booking_status?.toUpperCase() ||
                        (confirmData?.status === 'success' ? 'CONFIRMED' : null);
                    const moduleType = paymentData.module?.toUpperCase();

                    if (bookingStatus === "CONFIRMED") {
                        updateStep(1, "success");
                        setStatusMessage(t("bookingConfirmedIssuing"));

                        // Step 3: Issue ticket / Purchase policy
                        updateStep(2, "loading");

                        try {
                            console.log({ confirmData, paymentData });
                            const issueData = await issueTicket(confirmData, paymentData);

                            // Get module configuration from registry
                            const moduleConfig = getModuleConfig(moduleType);

                            // Check success using registry's isIssueSuccess function
                            const isSuccess = moduleConfig.isIssueSuccess(issueData);

                            if (isSuccess) {
                                updateStep(2, "success");
                                setStatus("success");
                                setStatusMessage(t(moduleConfig.translations.issueSuccess));

                                // Send voucher (non-blocking)
                                try {
                                    const { sendVoucher } = await import('../services/sechVoucher');
                                    sendVoucher(paymentData.booking_ref, moduleType || 'FLIGHT').catch(err => {
                                        console.error('Failed to send voucher:', err);
                                    });
                                } catch (err) {
                                    console.error('Failed to import sendVoucher:', err);
                                }

                                setTimeout(() => {
                                    const redirectConfig = buildStatusRedirectUrl(
                                        moduleType, paymentData, confirmData, issueData, gateway, false
                                    );
                                    router.push(buildRedirectUrlString(redirectConfig));
                                }, 1500);
                                return;
                            }

                            // If already issued (from alreadyIssued flag)
                            if (issueData?.alreadyIssued) {
                                updateStep(2, "success");
                                setStatus("success");
                                setStatusMessage(t(moduleConfig.translations.alreadyIssued));

                                try {
                                    const { sendVoucher } = await import('../services/sechVoucher');
                                    sendVoucher(paymentData.booking_ref, moduleType || 'FLIGHT').catch(err => {
                                        console.error('Failed to send voucher:', err);
                                    });
                                } catch (err) {
                                    console.error('Failed to import sendVoucher:', err);
                                }

                                setTimeout(() => {
                                    const redirectConfig = buildStatusRedirectUrl(
                                        moduleType, paymentData, confirmData, issueData, gateway, false
                                    );
                                    router.push(buildRedirectUrlString(redirectConfig));
                                }, 1500);
                                return;
                            }

                            // ANY other case - pending
                            updateStep(2, "success");
                            setStatus("partial-success");
                            setStatusMessage(t(moduleConfig.translations.pending));

                            setTimeout(() => {
                                const redirectConfig = buildStatusRedirectUrl(
                                    moduleType, paymentData, confirmData, issueData, gateway, true
                                );
                                router.push(buildRedirectUrlString(redirectConfig));
                            }, 3000);
                            return;
                        } catch (issueErr) {
                            // Ticket/Policy issuance failed but booking is confirmed
                            console.error("Issue ticket/policy error:", issueErr);
                            updateStep(2, "success");
                            setStatus("partial-success");
                            setStatusMessage(t(moduleConfig.translations.pending));

                            setTimeout(() => {
                                const redirectConfig = buildStatusRedirectUrl(
                                    moduleType, paymentData, confirmData, null, gateway, true
                                );
                                router.push(buildRedirectUrlString(redirectConfig));
                            }, 3000);
                            return;
                        }
                    }

                    // Booking is pending or processing
                    if (["PENDING", "PROCESSING"].includes(bookingStatus)) {
                        const moduleConfig = getModuleConfig(moduleType);
                        updateStep(1, "success");
                        updateStep(2, "success");
                        setStatus("partial-success");
                        setStatusMessage(t(moduleConfig.translations.pending));

                        setTimeout(() => {
                            const redirectConfig = buildStatusRedirectUrl(
                                moduleType, paymentData, confirmData, null, gateway, true
                            );
                            router.push(buildRedirectUrlString(redirectConfig));
                        }, 3000);
                        return;
                    }

                    // Other booking statuses - treat as partial success
                    const moduleConfigFallback = getModuleConfig(moduleType);
                    updateStep(1, "success");
                    updateStep(2, "success");
                    setStatus("partial-success");
                    setStatusMessage(t(moduleConfigFallback.translations.pending));

                    setTimeout(() => {
                        const redirectConfig = buildStatusRedirectUrl(
                            moduleType, paymentData, confirmData, null, gateway, true
                        );
                        router.push(buildRedirectUrlString(redirectConfig));
                    }, 3000);
                    return;
                } catch (confirmErr) {
                    // Booking confirmation failed but payment succeeded
                    const moduleType = paymentData.module?.toUpperCase();
                    const moduleConfigError = getModuleConfig(moduleType);
                    updateStep(1, "success");
                    updateStep(2, "success");
                    setStatus("partial-success");
                    setStatusMessage(t(moduleConfigError.translations.pending));

                    setTimeout(() => {
                        const redirectConfig = buildStatusRedirectUrl(
                            moduleType, paymentData, null, null, gateway, true
                        );
                        router.push(buildRedirectUrlString(redirectConfig));
                    }, 3000);
                    return;
                }
            }

            // Payment status unclear - retry
            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `${t("recheckingPaymentStatus")} (Retry ${retryCount + 1})`
                );
                setTimeout(
                    () => setRetryCount((n) => n + 1),
                    1600 + retryCount * 600
                );
                return;
            }

            setStatus("error");
            updateStep(0, "error");
            setStatusMessage(t("unableToDetermineStatus"));
        } catch (err) {
            console.error("Payment check error:", err);

            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `${t("networkIssueRetrying")} (${retryCount + 1}/${MAX_RETRIES})…`
                );
                setTimeout(() => setRetryCount((n) => n + 1), 1800);
                return;
            }

            setStatus("error");
            updateStep(0, "error");
            setStatusMessage(t("networkError"));
        }
    }, [booking_ref, gateway, order_ref, retryCount, router, updateStep, t]);

    const retry = useCallback(() => {
        setRetryCount(0);
        setStatus("loading");
        setSteps([
            { label: t("stepPaymentVerified"), status: "pending" },
            { label: t("stepBookingConfirmed"), status: "pending" },
            { label: t("stepTicketIssuance"), status: "pending" },
        ]);
    }, [t]);

    return {
        status,
        statusMessage,
        steps,
        checkPaymentStatus,
        retry,
    };
}
