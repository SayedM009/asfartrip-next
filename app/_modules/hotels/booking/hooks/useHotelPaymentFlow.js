"use client";

import { useState, useCallback, use } from "react";
import { useLocale } from "next-intl";
import { bookHotel } from "../services/hotelBookingService";
import { createTelrPayment } from "@/app/_modules/flight/booking/services/createTelrPayment";
import useHotelBookingStore from "../store/hotelBookingStore";
import { WebsiteConfigContext } from "@/app/_modules/config";

/**
 * Hook for hotel payment flow.
 * Handles: validate guests → book hotel → create payment → switch to step 3
 */
export function useHotelPaymentFlow({ guestInfo, setCurrentStep }) {
    const [loading, setLoading] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [telrIframeUrl, setTelrIframeUrl] = useState(null);

    const config = use(WebsiteConfigContext);
    const locale = useLocale();

    const setBookingReference = useHotelBookingStore((state) => state.setBookingReference);
    const setBookingPNR = useHotelBookingStore((state) => state.setBookingPNR);
    const setGateway = useHotelBookingStore((state) => state.setGateway);
    const getTotalPrice = useHotelBookingStore((state) => state.getTotalPrice);
    const getCurrency = useHotelBookingStore((state) => state.getCurrency);

    // ============================
    //   PROCEED TO PAYMENT
    // ============================
    const handleProceedToPayment = useCallback(async () => {
        // Validate all guest forms
        if (!guestInfo.triggerValidation()) {
            window.scrollTo({ top: 300, behavior: "smooth" });
            return;
        }

        setLoading(true);

        try {
            const { getFinalPayload, bookingReference } =
                useHotelBookingStore.getState();

            // Book hotel if not already booked
            if (!bookingReference) {
                const payload = getFinalPayload();
                const result = await bookHotel(payload);

                const ref = result?.BookHotel?.BookingReference;
                const pnr = result?.BookHotel?.BookingPNR;

                if (!ref) {
                    throw new Error("Failed to create hotel booking");
                }

                setBookingReference(ref);
                setBookingPNR(pnr || "");

                // Create payment
                const hasTelr = config?.payment_gateways?.some(
                    (gw) => gw.name.toLowerCase() === "telr"
                );

                if (hasTelr) {
                    try {
                        const telrData = await createTelrPayment({
                            amount: getTotalPrice().toString(),
                            currency: getCurrency(),
                            merchant_order_id: ref,
                            description: `Hotel booking - ${ref}`,
                            module: "HOTEL",
                            return_url: `${window.location.origin}/${locale}/payment/checkstatus/${ref}?gateway=telr&module=HOTEL`,
                            cancelled_url: `${window.location.origin}/${locale}/payment/checkstatus/${ref}?gateway=telr&module=HOTEL`,
                            declined_url: `${window.location.origin}/${locale}/payment/checkstatus/${ref}?gateway=telr&module=HOTEL`,
                        });

                        if (telrData.success && telrData.data?.payment_url) {
                            setTelrIframeUrl(telrData.data.payment_url);

                            if (telrData.data?.order_ref) {
                                sessionStorage.setItem(
                                    `telr_order_ref_${ref}`,
                                    telrData.data.order_ref
                                );
                            }

                            if (telrData.data?.gateway?.ifrurl) {
                                setGateway(telrData.data.gateway.ifrurl);
                            }
                        } else {
                            throw new Error("Failed to get Telr payment URL");
                        }
                    } catch (telrError) {
                        console.error("Telr payment creation failed:", telrError);
                        throw new Error("No payment gateway available");
                    }
                }
            }

            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            setErrorMessage(error.message || "Failed to proceed to payment");
            setErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [
        guestInfo,
        setBookingReference,
        setBookingPNR,
        setCurrentStep,
        setGateway,
        config,
        getTotalPrice,
        getCurrency,
        locale,
    ]);

    // ============================
    //       CONFIRM PAYMENT
    // ============================
    const handleConfirmPayment = useCallback(() => {
        try {
            const { gateway } = useHotelBookingStore.getState();

            if (!gateway?.ifrurl) {
                throw new Error("Payment gateway URL not found");
            }

            window.location.href = gateway.ifrurl;
        } catch (error) {
            setErrorMessage(error.message || "Failed to process payment");
            setErrorModalOpen(true);
        }
    }, []);

    const resetPaymentState = useCallback(() => {
        setTelrIframeUrl(null);
        const store = useHotelBookingStore.getState();
        store.setBookingReference("");
        store.setBookingPNR("");
        store.setGateway(null);
    }, []);

    return {
        loading,
        errorMessage,
        errorModalOpen,
        setErrorModalOpen,
        handleProceedToPayment,
        handleConfirmPayment,
        telrIframeUrl,
        resetPaymentState,
    };
}
