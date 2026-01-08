"use client";

import { useState, useRef } from "react";
import BookingSteps from "@/app/_components/BookingSteps";
import { BOOKING_STEPS } from "@/app/_modules/insurance/constants/steps.config";
import { useTranslations } from "next-intl";
import TravelerLoginSection from "@/app/_components/TravelerLoginSection";
import PlanSummarySidebar from "../molecules/PlanSummarySidebar";
import TopMobileSection from "@/app/_components/TopMobileSection";
import PlanDetailsDialog from "../molecules/PlanDetailsDialog";
import { BackWardButtonWithDirections } from "@/app/_components/navigation/BackwardButton";
import BookingPageTitle from "../../../../_components/BookingPageTitle";
import { Ticket } from "lucide-react";
import BookingPageSubTitle from "../../../../_components/BookingPageSubTitle";
import { Badge } from "@/components/ui/badge";
import TravelerInformationSection from "../organisms/TravelerInformationSection";
import ContactInformation from "../molecules/ContactInformation";
import PaymentSection from "@/app/_components/PaymentSection";
import { useInsurancePaymentFlow } from "../../hooks/useInsurancePaymentFlow";
import ErrorModal from "@/app/_components/ui/ErrorModal";
import MobileBottomBar from "../molecules/MobileBottomBar";

// Helper to create initial traveler object
function createEmptyTraveler(id, travelerNumber, travelerType) {
    return {
        id,
        travelerNumber,
        travelerType,
        title: "",
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        passportNumber: "",
        passportExpiry: null,
        nationality: "",
        isCompleted: false,
    };
}

// Build travelers array from passengers data
function buildTravelersFromPassengers(passengers) {
    const travelers = [];
    let id = 1;
    let travelerNumber = 1;

    // Adults (17-65)
    const adultsCount = Number(passengers.adults) || 0;
    for (let i = 0; i < adultsCount; i++) {
        travelers.push(createEmptyTraveler(id++, travelerNumber++, "Adult"));
    }

    // Children (0-16)
    const childrenCount = Number(passengers.children) || 0;
    for (let i = 0; i < childrenCount; i++) {
        travelers.push(createEmptyTraveler(id++, travelerNumber++, "Child"));
    }

    // Seniors (66-75)
    const seniorsCount = Number(passengers.seniors) || 0;
    for (let i = 0; i < seniorsCount; i++) {
        travelers.push(createEmptyTraveler(id++, travelerNumber++, "Senior"));
    }

    return travelers;
}

function BookingPage({ data, error, isLogged, userId, userType }) {
    const { cart } = data;
    const [currentStep, setCurrentStep] = useState(2);
    const t = useTranslations("Insurance");

    // Parse passengers from cart request
    const parsedRequest = JSON.parse(cart.request);
    const passengers = {
        adults: parsedRequest.adults,
        children: parsedRequest.children,
        seniors: parsedRequest.seniors,
    };
    const totalPassengers =
        Number(passengers.adults) +
        Number(passengers.children) +
        Number(passengers.seniors);

    // Local state for travelers
    const [travelers, setTravelers] = useState(() =>
        buildTravelersFromPassengers(passengers)
    );

    // Refs for imperative validation
    const travelerRefs = useRef([]);
    const contactRef = useRef(null);

    // Local state for contact info
    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "",
        countryCode: "+971",
        bookerName: "",
        bookingForSomeoneElse: false,
    });

    // Payment flow hook
    const {
        loading,
        errorMessage,
        errorModalOpen,
        setErrorModalOpen,
        telrIframeUrl,
        handleProceedToPayment,
        handleConfirmPayment,
    } = useInsurancePaymentFlow({
        cart,
        travelers,
        contactInfo,
        travelerRefs,
        contactRef,
        setCurrentStep,
        userId,
        userType,
    });

    // Update a single traveler
    const updateTraveler = (index, updatedTraveler) => {
        setTravelers((prev) =>
            prev.map((t, i) => (i === index ? updatedTraveler : t))
        );
    };

    // STEP 3: Payment
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-background">
                <BookingSteps steps={BOOKING_STEPS} currentStep={3} t={t} />

                <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                    {/* Payment Section */}
                    <PaymentSection
                        onConfirmPayment={handleConfirmPayment}
                        backTo={() => setCurrentStep(2)}
                        loading={loading}
                        iframeSrc={telrIframeUrl}
                        totalAmount={cart.premium}
                        MobileDetailsSlot={
                            <PlanDetailsDialog
                                quote={JSON.parse(cart.plan_json)}
                                withContinue={false}
                                trigger={{
                                    title: t("plan_details"),
                                    icon: <Ticket className="w-4 h-4" />,
                                }}
                            />
                        }
                    />

                    <div className="hidden lg:block lg:w-96">
                        <PlanSummarySidebar
                            quote={JSON.parse(cart.plan_json)}
                        />
                    </div>
                </div>

                <ErrorModal
                    isOpen={errorModalOpen}
                    onClose={() => setErrorModalOpen(false)}
                    message={errorMessage}
                />
            </div>
        );
    }

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
                        tKey="booking.enter_traveler_information_helper"
                    />
                </div>
                <div className="text-right shrink-0 rtl:text-left flex items-end">
                    <div className="text-lg text-primary-600 dark:text-primary-400">
                        <PlanDetailsDialog
                            quote={JSON.parse(cart.plan_json)}
                            withContinue={false}
                            trigger={{
                                title: t("plan_details"),
                                icon: <Ticket className="w-4 h-4" />,
                            }}
                        />
                    </div>
                </div>
            </TopMobileSection>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8 ">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-6">
                    {!isLogged && <TravelerLoginSection />}

                    {/* Travelers */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block">
                                    <BackWardButtonWithDirections />
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
                                    traveler={traveler}
                                    onTravelerChange={(updated) =>
                                        updateTraveler(index, updated)
                                    }
                                    travelerNumber={traveler.travelerNumber}
                                    travelerType={traveler.travelerType}
                                    isLoggedIn={isLogged}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Contact Information */}
                    <ContactInformation
                        ref={contactRef}
                        data={contactInfo}
                        onDataChange={setContactInfo}
                    />
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:w-96 lg:block">
                    <PlanSummarySidebar
                        quote={JSON.parse(cart.plan_json)}
                        onProceedToPayment={handleProceedToPayment}
                        loading={loading}
                    />
                </div>
            </div>

            {/* MOBILE BOTTOM BAR */}
            <MobileBottomBar
                handleProceedToPayment={handleProceedToPayment}
                loading={loading}
                quote={JSON.parse(cart.plan_json)}
            />

            <div className="h-20 sm:hidden" />

            <ErrorModal
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                message={errorMessage}
            />
        </div>
    );
}

export default BookingPage;
