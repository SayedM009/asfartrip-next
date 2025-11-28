// app/_modules/booking/components/template/BookingPage.jsx
"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

// Hooks
import { useBookingInitialization } from "../../hooks/useBookingInitialization";
import { usePaymentFlow } from "../../hooks/usePaymentFlow";
import { useContactInfo } from "../../hooks/useContactInfo";

// Store
import useBookingStore from "../../store/bookingStore";

// Atoms / Molecules / Organisms /
import BookingSteps from "../organism/BookingSteps";
import TravelerLoginSection from "../molecule/TravelerLoginSection";
import TravelerInformationSection from "../organism/TravelerInformationSection";
import ContactInformation from "../molecule/ContactInformation";
import BookingPageTravellerInfoSubTitle from "../molecule/BookingPageTravellerInfoSubTitle";
import MobileBottomBar from "../molecule/MobileBottomBar";
import BookingPageTravellerInfoTitle from "../atoms/BookingPageTravellerInfoTitle";
import TopMobileSection from "../organism/TopMobileSection";
import PaymentSection from "../organism/PaymentSection";
import FareSummarySidebar from "../organism/FareSummarySidebar";
import InsuranceSelection from "../molecule/InsuranceSelection";
import AddOn from "../molecule/AddOn";
import TicketExpired from "../atoms/TicketExpired";
import PriceChangeDialog from "../molecule/PriceChangeDialog";

// Components
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";
import { BackWardButtonWithDirections } from "@/app/_components/layout/BackwardButton";

export default function BookingPage({
    isLogged,
    cart: initialCart,
    userId,
    userType,
}) {
    const [currentStep, setCurrentStep] = useState(2);
    const travelerRefs = useRef([]);
    const t = useTranslations("Flight");
    const ticket = useBookingStore((state) => state.ticket);
    const searchInfo = useBookingStore((state) => state.searchInfo);
    const travelers = useBookingStore((state) => state.travelers);
    const getTotalPassengers = useBookingStore(
        (state) => state.getTotalPassengers
    );
    const searchURL = useBookingStore((state) => state.searchURL);

    const totalPassengers = getTotalPassengers();

    console.log("1- from BookingPage userType", userType);
    // init (userId + cart + insurance)
    useBookingInitialization({
        isLogged,
        userId,
        userType,
        initialCart,
    });

    // contact info hook
    const contactInfo = useContactInfo();

    // payment flow hook
    const {
        loading,
        errorMessage,
        errorModalOpen,
        setErrorModalOpen,
        handleProceedToPayment,
        handleConfirmPayment,
        telrIframeUrl, // Get Telr iframe URL from hook
    } = usePaymentFlow({
        contactInfo,
        travelerRefs,
        setCurrentStep,
    });

    const segments =
        ticket?.segments ||
        ticket?.onward?.segments ||
        ticket?.return?.segments ||
        [];

    if (!segments?.length) return <TicketExpired />;

    // STEP 3: Payment
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-background">
                <BookingSteps currentStep={3} />

                <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                    <PaymentSection
                        onConfirmPayment={handleConfirmPayment}
                        backTo={() => setCurrentStep(2)}
                        loading={loading}
                        iframeSrc={telrIframeUrl}
                    />

                    <div className="hidden lg:block lg:w-96">
                        <FareSummarySidebar loading={loading} />
                    </div>
                </div>
            </div>
        );
    }

    // STEP 2: Traveler Details
    return (
        <div className="min-h-screen mt-15 sm:mt-auto">
            <BookingSteps currentStep={currentStep} />

            {/* MOBILE HEADER */}
            <TopMobileSection t={t} ticket={ticket}>
                <BackWardButtonWithDirections />
                <div className="flex-1 min-w-0">
                    <BookingPageTravellerInfoTitle t={t} />

                    <BookingPageTravellerInfoSubTitle
                        t={t}
                        searchInfo={searchInfo}
                    />
                </div>
            </TopMobileSection>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-6">
                    {!isLogged && <TravelerLoginSection />}

                    {/* Travelers */}
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

                    {/* AddOns */}
                    <AddOn />

                    {/* Contact Info */}
                    <ContactInformation
                        data={contactInfo.data || {}}
                        errors={contactInfo.errors}
                        showValidation={contactInfo.showValidation}
                        onChange={contactInfo.setField}
                    />

                    {/* Insurance */}
                    <InsuranceSelection />

                    <div className="h-20 sm:hidden" />
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:w-96 lg:block">
                    <FareSummarySidebar
                        onProceedToPayment={handleProceedToPayment}
                        loading={loading}
                    />
                </div>
            </div>

            {/* MOBILE BOTTOM BAR */}
            <MobileBottomBar
                t={t}
                handleProceedToPayment={handleProceedToPayment}
                loading={loading}
            />
            <TimeoutPopup timeoutMinutes={15} redirectLink={searchURL} />

            {/* Error Modal Placeholder */}
            {errorModalOpen && <div className="hidden">{errorMessage}</div>}

            {/* Price Change Dialog */}
            <PriceChangeDialog />
        </div>
    );
}
