"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackWardButtonWithDirections } from "../flightSearchNavWrapper/BackwardButton";
import { useTranslations } from "next-intl";
import { InsuranceSelection } from "./InsuranceSelection";
import { savePassengers } from "@/app/_libs/flightService";

import BookingSteps from "./BookingSteps";
import TravelerLoginSection from "./TravelerLoginSection";
import TravelerInformationSection from "./TravelerInformationSection";
import ContactInformation from "./ContactInformation";
import FareSummarySidebar from "./FareSummarySidebar";
import PaymentSection from "./PaymentSection";
import ChevronBasedOnLanguage from "../../ui/ChevronBasedOnLanguage";
import useBookingStore from "@/app/_store/bookingStore";
import TimeoutPopup from "../../ui/TimeoutPopup";
import AddOn from "./AddOn";
import TopMobileSection from "./TopMobileSection";
import TicketExpired from "./TicketExpired";
import FareSummaryDialog from "./FareSummaryDialog";

export default function BookingPage({ isLogged, cart: initialCart, userId }) {
    const [currentStep, setCurrentStep] = useState(2);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const t = useTranslations("Flight");
    const contactInfoRef = useRef(null);
    const travelerRefs = useRef([]);

    const {
        ticket,
        searchInfo,
        travelers,
        addOns,
        getTotalPassengers,
        setInsurancePlans,
        setUserId,
        setCart,
        setBookingData,
        bookingReference,
        gateway,
        searchURL,
        setSameBookingURL,
    } = useBookingStore();

    const totalPassengers = getTotalPassengers();

    // Assign User Id into Booking Store
    useEffect(() => {
        if (isLogged && userId) setUserId(userId);
    }, [isLogged, userId, setUserId]);

    // Assign Cart & Insurance Plans Into Booking Store
    useEffect(() => {
        if (initialCart) {
            setCart(initialCart.CartData);
            if (initialCart.Premium) setInsurancePlans(initialCart.Premium);
        }
    }, [initialCart, setCart, setInsurancePlans]);

    // Handle Procceed to 3th Step (Payment)
    const handleProceedToPayment = async () => {
        let allValid = true;

        travelerRefs.current.forEach((ref) => {
            if (ref?.triggerValidation && !ref.triggerValidation())
                allValid = false;
        });

        if (contactInfoRef.current?.triggerValidation) {
            const isContactValid = contactInfoRef.current.triggerValidation();
            if (!isContactValid) allValid = false;
        }

        if (!allValid) {
            window.scrollTo({ top: 300, behavior: "smooth" });
            return;
        }

        setLoading(true);
        try {
            const { isDataModified, setDataModified } =
                useBookingStore.getState();
            if (isDataModified || !bookingReference || !gateway) {
                const finalPayload = useBookingStore
                    .getState()
                    .getFinalPayload();

                const data = await savePassengers(finalPayload);

                if (
                    data.status === "success" &&
                    data.booking_reference &&
                    data.gateway
                ) {
                    setBookingData(data);
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
            console.error("Save passengers error:", error.message);
            setErrorMessage(error.message || "Failed to proceed to payment");
            setErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Choosen Payment Method
    const handleConfirmPayment = () => {
        try {
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
    };

    const segments =
        ticket?.segments ||
        ticket?.onward?.segments ||
        ticket?.return?.segments ||
        [];

    if (!segments?.length) return <TicketExpired />;

    // Payment Step
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-transparent">
                <BookingSteps currentStep={3} />
                <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                    <PaymentSection
                        onConfirmPayment={handleConfirmPayment}
                        backTo={() => setCurrentStep(2)}
                        loading={loading}
                    />
                    <div className="hidden lg:block lg:w-96">
                        <FareSummarySidebar loading={loading} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-15 sm:mt-auto">
            <BookingSteps currentStep={currentStep} />
            <TopMobileSection ticket={ticket}>
                <BackWardButtonWithDirections />
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-semibold capitalize">
                        {t("booking.enter_traveler_information")}
                    </h1>
                    <div className="capitalize flex items-center gap-2 text-xs text-muted-foreground truncate">
                        <span>
                            {t(
                                `ticket_class.${String(
                                    searchInfo.class
                                ).toLowerCase()}`
                            )}
                        </span>
                        |
                        <div className="flex items-center gap-2">
                            {searchInfo.origin}
                            <ChevronBasedOnLanguage icon="arrow" size="3" />
                            {searchInfo.destination}
                        </div>
                    </div>
                </div>
            </TopMobileSection>

            <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    {!isLogged && <TravelerLoginSection />}

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block">
                                    <BackWardButtonWithDirections
                                        href={searchURL}
                                    />
                                </div>
                                <h2 className="font-semibold text-xl">
                                    {t("booking.traveler_information")}
                                </h2>
                            </div>
                            <Badge variant="outline">
                                {String(totalPassengers).padStart(2, "0")}{" "}
                                {totalPassengers === 1
                                    ? t("booking.traveler")
                                    : t("booking.travelers")}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {travelers.map((traveler, index) => (
                                <TravelerInformationSection
                                    key={traveler.id}
                                    ref={(el) =>
                                        (travelerRefs.current[index] = el)
                                    }
                                    travelerNumber={traveler.travelerNumber}
                                    travelerType={traveler.travelerType}
                                    isLoggedIn={isLogged}
                                />
                            ))}
                        </div>
                    </section>

                    <AddOn />
                    <ContactInformation ref={contactInfoRef} />

                    <InsuranceSelection />
                    <div className="h-20 sm:hidden" />
                </div>

                <div className="hidden  lg:w-96 lg:block ">
                    <FareSummarySidebar
                        onProceedToPayment={handleProceedToPayment}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
                <div className="p-3">
                    <FareSummaryDialog />
                    <Button
                        onClick={handleProceedToPayment}
                        size="lg"
                        disabled={loading}
                        className="btn-primary rtl:flex-row-reverse ltr:flex-row-reverse w-full"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <ChevronBasedOnLanguage size="5" />
                        )}
                        {t("booking.proceed_to_payment")}
                    </Button>
                </div>
            </div>

            <TimeoutPopup timeoutMinutes={15} redirectLink={searchURL} />
        </div>
    );
}
