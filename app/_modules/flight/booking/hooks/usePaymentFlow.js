// app/_modules/booking/hooks/usePaymentFlow.js
"use client";

import { useState, useCallback } from "react";
import { savePassengers } from "../services/savePassengersService";
import useBookingStore from "../store/bookingStore";

export function usePaymentFlow({ contactInfo, travelerRefs, setCurrentStep }) {
    const [loading, setLoading] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const setBookingRef = useBookingStore((state) => state.setBookingRef);
    const setDataModified = useBookingStore((state) => state.setDataModified);
    const setGateway = useBookingStore((state) => state.setGateway);
    const setSameBookingURL = useBookingStore(
        (state) => state.setSameBookingURL
    );

    // ============================
    //   PROCEED TO PAYMENT
    // ============================
    const handleProceedToPayment = useCallback(async () => {
        let allValid = true;

        // ✅ validate travelers عبر الـ refs
        travelerRefs.current.forEach((ref) => {
            if (ref?.triggerValidation && !ref.triggerValidation()) {
                allValid = false;
            }
        });

        // ✅ validate contact info عبر الـ hook
        if (contactInfo?.triggerValidation) {
            const ok = contactInfo.triggerValidation();
            if (!ok) allValid = false;
        }

        if (!allValid) {
            window.scrollTo({ top: 300, behavior: "smooth" });
            return;
        }

        setLoading(true);

        try {
            const {
                isDataModified,
                getFinalPayload,
                bookingReference,
                gateway,
            } = useBookingStore.getState();

            if (isDataModified || !bookingReference || !gateway) {
                const finalPayload = getFinalPayload();
                const data = await savePassengers(finalPayload);

                if (
                    data.status === "success" &&
                    data.booking_reference &&
                    data.gateway
                ) {
                    setBookingRef(data.booking_reference);
                    console.log(data.gateway.ifrurl);
                    setGateway(data.gateway.ifrurl);
                    setDataModified(false);
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    throw new Error(
                        data.message || "Failed to save passengers"
                    );
                }
            } else {
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (error) {
            setErrorMessage(error.message || "Failed to proceed to payment");
            setErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [
        travelerRefs,
        contactInfo,
        setBookingRef,
        setDataModified,
        setCurrentStep,
        setGateway,
    ]);

    // ============================
    //       CONFIRM PAYMENT
    // ============================
    const handleConfirmPayment = useCallback(() => {
        try {
            const { gateway } = useBookingStore.getState();

            if (gateway?.ifrurl) {
                window.location.href = gateway.ifrurl;
                setSameBookingURL(window.location.href);
            } else {
                throw new Error("Payment gateway URL not found");
            }
        } catch (error) {
            setErrorMessage(error.message || "Failed to process payment");
            setErrorModalOpen(true);
        }
    }, [setSameBookingURL]);

    return {
        loading,
        errorMessage,
        errorModalOpen,
        setErrorModalOpen,
        handleProceedToPayment,
        handleConfirmPayment,
    };
}
