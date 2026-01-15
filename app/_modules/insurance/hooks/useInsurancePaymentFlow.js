"use client";

import { useState, useCallback, use } from "react";
import { useLocale } from "next-intl";
import { saveInsurancePassengers } from "../service/savePassengersAPI";
import { WebsiteConfigContext } from "@/app/_modules/config";

/**
 * Transform travelers array to API payload format
 */
function transformTravelersToPayload(travelers) {
    return travelers.map((t) => ({
        type: t.travelerType.toLowerCase(),
        title: t.title || "",
        firstName: t.firstName?.toUpperCase() || "",
        lastName: t.lastName?.toUpperCase() || "",
        passportNumber: t.passportNumber || "",
        nationality: t.nationality || "",
        dob: t.dateOfBirth || "",
        expiry: t.passportExpiry || "",
    }));
}

/**
 * Hook for managing insurance payment flow
 * Validates travelers & contact, saves passengers, prepares payment gateway
 */
export function useInsurancePaymentFlow({
    cart,
    travelers,
    contactInfo,
    travelerRefs,
    contactRef,
    setCurrentStep,
    userId = 0,
    userType = 0,
}) {
    const [loading, setLoading] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [bookingReference, setBookingReference] = useState(null);
    const [gatewayUrl, setGatewayUrl] = useState(null);
    const [telrIframeUrl, setTelrIframeUrl] = useState(null);

    // Get config from context
    const config = use(WebsiteConfigContext);
    const locale = useLocale();

    // ============================
    //   PROCEED TO PAYMENT
    // ============================
    const handleProceedToPayment = useCallback(async () => {
        let allValid = true;

        // 1. Validate all travelers via refs
        travelerRefs.current.forEach((ref) => {
            if (ref?.triggerValidation && !ref.triggerValidation()) {
                allValid = false;
            }
        });

        // 2. Validate contact info via ref
        if (contactRef.current?.triggerValidation) {
            const ok = contactRef.current.triggerValidation();
            if (!ok) allValid = false;
        }

        if (!allValid) {
            window.scrollTo({ top: 300, behavior: "smooth" });
            return;
        }

        setLoading(true);

        try {
            // 3. Transform travelers to payload format
            const passengersPayload = transformTravelersToPayload(travelers);

            // Find lead passenger (first adult or first traveler)
            const leadPassenger = passengersPayload.find(p => p.type === "adult") || passengersPayload[0];
            const leadpax = `${leadPassenger?.firstName || ""} ${leadPassenger?.lastName || ""}`.trim();

            // 4. Build final payload
            const finalPayload = {
                TravelerDetails: passengersPayload,
                GUEST_FIRSTNAME: leadPassenger?.firstName || "",
                GUEST_LASTNAME: leadPassenger?.lastName || "",
                GUEST_EMAIL: contactInfo.email || "",
                GUEST_PHONE: `${contactInfo.countryCode || "+971"}${contactInfo.phone || ""}`,
                leadpax: leadpax,
                session_id: cart.session_id,
                temp_id: cart.id,
                cid: cart.id,
                transaction_status: "PROCESS",
                payment_method: "Payment Gateway",
                booking_status: "PROCESS",
                currency: "AED",
                rate: 1,
                payment_status: 0,
                amount: cart.premium || 0,
                user_type: userType,
                user_id: userId,
            };

            // 5. Save passengers
            const data = await saveInsurancePassengers(finalPayload);

            if (data.status === "success" && data.booking_reference) {
                setBookingReference(data.booking_reference);

                // 6. Check for Telr in config
                const hasTelr = config?.payment_gateways?.some(
                    (gw) => gw.name?.toLowerCase() === "telr"
                );

                if (hasTelr) {
                    // Create Telr payment
                    try {
                        const telrResponse = await fetch("/api/payment/create-telr", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                amount: (cart.premium || 0).toString(),
                                currency: "AED",
                                merchant_order_id: data.booking_reference,
                                description: `Insurance booking - ${data.booking_reference}`,
                                module: "INSURANCE",
                                return_url: `${window.location.origin}/${locale}/payment/checkstatus/${data.booking_reference}?gateway=telr&module=insurance`,
                                cancelled_url: `${window.location.origin}/${locale}/payment/checkstatus/${data.booking_reference}?gateway=telr&module=insurance`,
                                declined_url: `${window.location.origin}/${locale}/payment/checkstatus/${data.booking_reference}?gateway=telr&module=insurance`,
                            }),
                        });

                        const telrData = await telrResponse.json();

                        if (telrData.success && telrData.data?.payment_url) {
                            setTelrIframeUrl(telrData.data.payment_url);

                            if (telrData.data?.order_ref) {
                                sessionStorage.setItem(
                                    `telr_order_ref_${data.booking_reference}`,
                                    telrData.data.order_ref
                                );
                            }
                        } else {
                            throw new Error("Failed to get Telr payment URL");
                        }
                    } catch (telrError) {
                        console.error("Telr payment creation failed:", telrError);
                        // Fallback to gateway from savePassengers response
                        if (data.gateway?.ifrurl) {
                            setGatewayUrl(data.gateway.ifrurl);
                        }
                    }
                } else {
                    // Use external gateway (Ziina, etc.)
                    if (data.gateway?.ifrurl) {
                        setGatewayUrl(data.gateway.ifrurl);
                    }
                }

                // 7. Move to step 3
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                throw new Error(data.message || "Failed to save passengers");
            }
        } catch (error) {
            setErrorMessage(error.message || "Failed to proceed to payment");
            setErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [
        travelers,
        contactInfo,
        cart,
        travelerRefs,
        contactRef,
        setCurrentStep,
        config,
        locale,
        userId,
        userType,
    ]);

    // ============================
    //       CONFIRM PAYMENT (for external gateways like Ziina)
    // ============================
    const handleConfirmPayment = useCallback(() => {
        if (gatewayUrl) {
            window.location.href = gatewayUrl;
        } else {
            setErrorMessage("Payment gateway URL not found");
            setErrorModalOpen(true);
        }
    }, [gatewayUrl]);

    return {
        loading,
        errorMessage,
        errorModalOpen,
        setErrorModalOpen,
        bookingReference,
        gatewayUrl,
        telrIframeUrl,
        handleProceedToPayment,
        handleConfirmPayment,
    };
}
