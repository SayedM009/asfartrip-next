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
import BookingSteps from "@/app/_components/BookingSteps";
import TravelerInformationSection from "../organism/TravelerInformationSection";
import ContactInformation from "../molecule/ContactInformation";
import MobileBottomBar from "../molecule/MobileBottomBar";
import TopMobileSection from "@/app/_components/TopMobileSection";
import PaymentSection from "../organism/PaymentSection";
import FareSummarySidebar from "../organism/FareSummarySidebar";
import InsuranceSelection from "../molecule/InsuranceSelection";
import AddOn from "../molecule/AddOn";
import TicketExpired from "../atoms/TicketExpired";
import PriceChangeDialog from "../molecule/PriceChangeDialog";

// Components
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";
import { BackWardButtonWithDirections } from "@/app/_components/navigation/BackwardButton";
import { BOOKING_STEPS } from "../../config/steps.config";
import TravelerLoginSection from "@/app/_components/TravelerLoginSection";
import { Ticket } from "lucide-react";
import { FlightDetailsDialog } from "../../../results/components/organism/FlightDetailsDialog";
import BookingPageTitle from "@/app/_components/BookingPageTitle";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
import BookingPageSubTitle from "@/app/_components/BookingPageSubTitle";

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
                <BookingSteps steps={BOOKING_STEPS} currentStep={3} t={t} />

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
            <BookingSteps steps={BOOKING_STEPS} currentStep={2} t={t} />

            {/* MOBILE HEADER */}
            <TopMobileSection>
                <BackWardButtonWithDirections />
                <div className="flex-1 min-w-0">
                    <BookingPageTitle
                        t={t}
                        tKey="booking.enter_traveler_information"
                    />

                    <BookingPageSubTitle
                        t={t}
                        tKey={`ticket_class.${String(
                            searchInfo.class
                        ).toLowerCase()}`}
                    >
                        {searchInfo.origin}
                        <ChevronBasedOnLanguage icon="arrow" size="3" />
                        {searchInfo.destination}
                    </BookingPageSubTitle>
                </div>
                <div className="text-right shrink-0 rtl:text-left flex items-end">
                    <div className="text-lg text-primary-600 dark:text-primary-400">
                        <FlightDetailsDialog
                            ticket={ticket}
                            // isOpen={showDetailsDialog}
                            // onClose={() =>
                            //     setShowDetailsDialog(!showDetailsDialog)
                            // }
                            withContinue={false}
                            trigger={{
                                title: t("booking.details"),
                                icon: <Ticket className="w-4 h-4" />,
                            }}
                        />
                    </div>
                </div>
            </TopMobileSection>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-6">
                    {!isLogged && <TravelerLoginSection />}

                    {console.log(travelers)}
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
