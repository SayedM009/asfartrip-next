"use client";

import { useState, useCallback, useContext } from "react";
import { useLocale } from "next-intl";
import { savePassengers } from "../services/savePassengersService";
import { createTelrPayment } from "../services/createTelrPayment";
import useBookingStore from "../store/bookingStore";
import { WebsiteConfigContext } from "@/app/_modules/config";

export function usePaymentFlow({ contactInfo, travelerRefs, setCurrentStep }) {
    const [loading, setLoading] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [telrIframeUrl, setTelrIframeUrl] = useState(null);

    // Get config from context
    const config = useContext(WebsiteConfigContext);

    // Get current locale
    const locale = useLocale();


    const setBookingRef = useBookingStore((state) => state.setBookingRef);
    const setDataModified = useBookingStore((state) => state.setDataModified);
    const setGateway = useBookingStore((state) => state.setGateway);
    const getTotalPrice = useBookingStore((state) => state.getTotalPrice);
    const setSameBookingURL = useBookingStore(
        (state) => state.setSameBookingURL
    );

    // ============================
    //   PROCEED TO PAYMENT
    // ============================
    const handleProceedToPayment = useCallback(async () => {
        let allValid = true;

        //  validate travelers عبر الـ refs
        travelerRefs.current.forEach((ref) => {
            if (ref?.triggerValidation && !ref.triggerValidation()) {
                allValid = false;
            }
        });

        //  validate contact info عبر الـ hook
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
                    data.booking_reference
                ) {
                    setBookingRef(data.booking_reference);
                    setSameBookingURL(window.location.href);



                    // Check if Telr is available in config
                    const hasTelr = config?.payment_gateways?.some(
                        (gw) => gw.name.toLowerCase() === "telr"
                    );


                    if (hasTelr) {
                        // Create Telr payment
                        try {
                            const telrData = await createTelrPayment({
                                amount: getTotalPrice().toString(),
                                currency: "AED",
                                merchant_order_id: data.booking_reference,
                                description: `Flight booking - ${data.booking_reference}`,
                                module: "FLIGHT",
                                return_url: `${window.location.origin}/${locale}/payment/checkstatus/${data.booking_reference}?gateway=telr`,
                                cancelled_url: `${window.location.origin}/${locale}/payment/checkstatus/${data.booking_reference}?gateway=telr`,
                                declined_url: `${window.location.origin}/${locale}/payment/checkstatus/${data.booking_reference}?gateway=telr`,
                            });


                            if (telrData.success && telrData.data?.payment_url) {
                                // Store Telr iframe URL in separate state
                                setTelrIframeUrl(telrData.data.payment_url);

                                // Store order_ref in sessionStorage for checkstatus page
                                if (telrData.data?.order_ref) {
                                    sessionStorage.setItem(
                                        `telr_order_ref_${data.booking_reference}`,
                                        telrData.data.order_ref
                                    );
                                }

                                // Don't store in gateway.ifrurl - keep it for other gateways
                                // If there are other gateways from savePassengers, store them
                                if (data.gateway?.ifrurl) {
                                    setGateway(data.gateway.ifrurl);
                                }
                            } else {
                                throw new Error("Failed to get Telr payment URL");
                            }
                        } catch (telrError) {
                            console.error("Telr payment creation failed:", telrError);
                            // Fallback to external gateway if Telr fails
                            if (data.gateway?.ifrurl) {
                                setGateway(data.gateway.ifrurl);
                            } else {
                                throw new Error("No payment gateway available");
                            }
                        }
                    } else {
                        // Use external gateway (Ziina, etc.)
                        if (data.gateway?.ifrurl) {
                            setGateway(data.gateway.ifrurl);
                        } else {
                            throw new Error("No payment gateway available");
                        }
                    }

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

            if (!gateway?.ifrurl) {
                throw new Error("Payment gateway URL not found");
            }

            // Redirect to external gateway (Ziina, Tabby, Tamara, Cryptadium)
            window.location.href = gateway.ifrurl;
            setSameBookingURL(window.location.href);
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
        telrIframeUrl, // Return Telr iframe URL
    };
}
