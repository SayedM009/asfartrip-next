"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Hooks
import { useHotelBookingInit } from "../../hooks/useHotelBookingInit";
import { useGuestInfo } from "../../hooks/useGuestInfo";
import { useHotelPaymentFlow } from "../../hooks/useHotelPaymentFlow";

// Store
import useHotelBookingStore from "../../store/hotelBookingStore";

// Config
import { HOTEL_BOOKING_STEPS } from "../../config/steps.config";

// Shared Components
import BookingSteps from "@/app/_components/BookingSteps";
import TopMobileSection from "@/app/_components/TopMobileSection";
import { BackWardButtonWithDirections } from "@/app/_components/navigation/BackwardButton";
import TravelerLoginSection from "@/app/_components/TravelerLoginSection";
import BookingPageTitle from "@/app/_components/BookingPageTitle";
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";

// Hotel Booking Components
import GuestInformationSection from "../organisms/GuestInformationSection";
import HotelSummarySidebar from "../organisms/HotelSummarySidebar";
import HotelPaymentSection from "../organisms/HotelPaymentSection";
import HotelMobileBottomBar from "../molecules/HotelMobileBottomBar";

export default function HotelBookingPage({ isLogged, userId, userType }) {
    const [currentStep, setCurrentStep] = useState(2);
    const t = useTranslations("Hotels");

    const searchURL = useHotelBookingStore((state) => state.searchURL);
    const hotelInfo = useHotelBookingStore((state) => state.hotelInfo);

    // Init hook
    useHotelBookingInit({ isLogged, userId, userType });

    // Guest info hook
    const guestInfo = useGuestInfo();

    // Payment flow hook
    const {
        loading,
        errorMessage,
        errorModalOpen,
        setErrorModalOpen,
        handleProceedToPayment,
        handleConfirmPayment,
        telrIframeUrl,
        resetPaymentState,
    } = useHotelPaymentFlow({ guestInfo, setCurrentStep });

    // STEP 3: Payment
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-background">
                <BookingSteps steps={HOTEL_BOOKING_STEPS} currentStep={3} t={t} />

                <div className=" py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                    <HotelPaymentSection
                        onConfirmPayment={handleConfirmPayment}
                        backTo={() => {
                            resetPaymentState();
                            setCurrentStep(2);
                        }}
                        loading={loading}
                        iframeSrc={telrIframeUrl}
                    />

                    <div className="hidden lg:block lg:w-96">
                        <HotelSummarySidebar loading={loading} />
                    </div>
                </div>
            </div>
        );
    }

    // STEP 2: Guest Information
    return (
        <div className="min-h-screen mt-15 sm:mt-auto">
            <BookingSteps steps={HOTEL_BOOKING_STEPS} currentStep={2} t={t} />

            {/* MOBILE HEADER */}
            <TopMobileSection>
                <BackWardButtonWithDirections href={searchURL} />
                <div className="flex-1 min-w-0">
                    <BookingPageTitle t={t} tKey="booking.guest_information" />
                    <p className="text-xs text-muted-foreground truncate">
                        {hotelInfo?.name}
                    </p>
                </div>
            </TopMobileSection>

            {/* CONTENT */}
            <div className=" py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-6">
                    {!isLogged && <TravelerLoginSection />}

                    {/* Guest Info Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block">
                                    <BackWardButtonWithDirections href={searchURL} />
                                </div>
                                <h2 className="font-semibold text-xl">
                                    {t("booking.guest_information")}
                                </h2>
                            </div>
                        </div>

                        <GuestInformationSection
                            leadGuest={guestInfo.leadGuest}
                            otherGuests={guestInfo.otherGuests}
                            updateLeadGuest={guestInfo.updateLeadGuest}
                            updateOtherGuest={guestInfo.updateOtherGuest}
                            getLeadErrors={guestInfo.getLeadErrors}
                            getOtherGuestErrors={guestInfo.getOtherGuestErrors}
                        />
                    </section>

                    <div className="h-20 sm:hidden" />
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:w-96 lg:block">
                    <HotelSummarySidebar
                        onProceedToPayment={handleProceedToPayment}
                        loading={loading}
                    />
                </div>
            </div>

            {/* MOBILE BOTTOM BAR */}
            <HotelMobileBottomBar
                handleProceedToPayment={handleProceedToPayment}
                loading={loading}
            />

            <TimeoutPopup timeoutMinutes={15} redirectLink={searchURL} />

            {errorModalOpen && <div className="hidden">{errorMessage}</div>}
        </div>
    );
}
