"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/app/_context/CurrencyContext";
import BackwardButton, {
    BackWardButtonWithDirections,
} from "../flightSearchNavWrapper/BackwardButton";
import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
import BookingSteps from "./BookingSteps";
import TravelerLoginSection from "./TravelerLoginSection";
import TravelerInformationSection from "./TravelerInformationSection";
import ContactInformation from "./ContactInformation";
import FareSummarySidebar from "./FareSummarySidebar";
import BaggageDialog from "./BaggageDialog";
import MealsDialog from "./MealsDialog";
import PaymentSection from "./PaymentSection";
import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
import useFlightTicket from "@/app/_store/ticketStore";
import useBookingStore from "@/app/_store/bookingStore";
import { useTranslations } from "next-intl";
import { InsuranceSelection } from "./InsuranceSelection";

export default function BookingPage({ isLogged, cart }) {
    const [currentStep, setCurrentStep] = useState(2);
    const [initialized, setInitialized] = useState(false);
    const contactInfoRef = useRef(null);
    const travelerRefs = useRef([]);
    const { formatPrice } = useCurrency();

    const t = useTranslations("Flight");

    const {
        setCart,
        selectedInsurance,
        setSelectedInsurance,
        getInsuranceTotal,
        getTotalPassengers,
        insurancePlans,
        setInsurancePlans,
    } = useBookingStore();

    // Get data from ticketStore
    const ticketFromStore = useFlightTicket((state) => state.ticket);
    const searchFromStore = useFlightTicket((state) => state.searchInfo);

    // Get/Set data in bookingStore
    const bookingTicket = useBookingStore((state) => state.ticket);
    const bookingSearch = useBookingStore((state) => state.searchInfo);
    const setTicket = useBookingStore((state) => state.setTicket);
    const setSearchInfo = useBookingStore((state) => state.setSearchInfo);

    const travelers = useBookingStore((state) => state.travelers);
    const addOns = useBookingStore((state) => state.addOns);
    const getTotalPrice = useBookingStore((state) => state.getTotalPrice);
    const getAddOnsTotal = useBookingStore((state) => state.getAddOnsTotal);

    // Initialize booking store with ticket store data
    useEffect(() => {
        if (
            !initialized &&
            ticketFromStore &&
            Object.keys(ticketFromStore).length > 0
        ) {
            setTicket(ticketFromStore);
            if (searchFromStore && Object.keys(searchFromStore).length > 0) {
                setSearchInfo(searchFromStore);
            }
            setInitialized(true);
        }
    }, [
        ticketFromStore,
        searchFromStore,
        initialized,
        setTicket,
        setSearchInfo,
    ]);

    // تحديد التأمين الافتراضي عند التحميل
    useEffect(() => {
        if (insurancePlans?.length > 0 && !selectedInsurance) {
            // Set "No Insurance" as default
            const noInsuranceOption = {
                quote_id: 0,
                scheme_id: 0,
                name: "No Insurance",
                premium: 0,
            };
            setSelectedInsurance(noInsuranceOption);
        }
    }, [insurancePlans, selectedInsurance, setSelectedInsurance]);

    useEffect(() => {
        if (cart) {
            setCart(cart.CartData);
            if (cart.Premium) {
                setInsurancePlans(cart.Premium);
                console.log("Insurance plans from cart:", cart.Premium);
            }
        }
    }, [cart, setCart, setInsurancePlans]);

    // معالجة تغيير التأمين
    const handleInsuranceChange = (insurance) => {
        setSelectedInsurance(insurance);
        console.log("Selected insurance:", insurance);
    };

    // حساب إجمالي التأمين
    const insuranceTotal = getInsuranceTotal();
    const totalPassengers = getTotalPassengers();

    // Use booking store data (which is synced from ticket store)
    const bookingData = bookingTicket;
    const searchParams = bookingSearch;

    const segments =
        bookingData?.segments ||
        bookingData?.onward?.segments ||
        bookingData?.return?.segments ||
        [];

    // Ticket Expired or not Found
    if (!segments || segments.length === 0) return <TicketExpired />;

    // const totalPassengers =
    //     (searchParams?.ADT || 1) +
    //     (searchParams?.CHD || 0) +
    //     (searchParams?.INF || 0);

    const dynamicTotal = getTotalPrice();
    const addOnsTotal = getAddOnsTotal();

    const handleProceedToPayment = () => {
        let allValid = true;

        // Validate all travelers using refs
        travelerRefs.current.forEach((ref) => {
            if (ref && ref.triggerValidation) {
                const isValid = ref.triggerValidation();
                if (!isValid) allValid = false;
            }
        });

        // Validate contact info
        if (
            contactInfoRef.current &&
            contactInfoRef.current.triggerValidation
        ) {
            const isContactValid = contactInfoRef.current.triggerValidation();
            if (!isContactValid) allValid = false;
        }

        if (!allValid) {
            window.scrollTo({ top: 300, behavior: "smooth" });
            return;
        }

        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBackToInformation = () => {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleConfirmPayment = () => {
        const bookingState = useBookingStore.getState();
        console.log("Booking Data:", {
            ticket: bookingState.ticket,
            travelers: bookingState.travelers,
            contactInfo: bookingState.contactInfo,
            addOns: bookingState.addOns,
        });
        alert("Payment confirmed! Booking ID: BK" + Date.now());
    };

    // Payment Step
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-transparent">
                <BookingSteps currentStep={currentStep} />

                <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-6 lg:py-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between">
                        <PaymentSection
                            totalAmount={dynamicTotal}
                            currency={bookingData.SITECurrencyType}
                            onConfirmPayment={handleConfirmPayment}
                            backTo={handleBackToInformation}
                            ticket={bookingData}
                        />

                        <div className="hidden lg:block lg:w-96">
                            <FareSummarySidebar
                                ticket={bookingData}
                                totalPrice={dynamicTotal}
                                basePrice={bookingData.BasePrice}
                                taxes={bookingData.Taxes + addOnsTotal}
                                insuranceTotal={insuranceTotal}
                                currency={bookingData.SITECurrencyType}
                                fareType={bookingData.FareType}
                                refundable={bookingData.Refundable}
                                holdBooking={bookingData.HoldBooking}
                                segments={segments}
                            />
                        </div>
                    </div>
                </div>

                {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50 p-4">
                    <div className="text-xl text-primary-600 dark:text-primary-400 text-center mb-2">
                        Total: {bookingData.SITECurrencyType}{" "}
                        {dynamicTotal.toFixed(2)}
                    </div>
                </div> */}
                {/* <div className="lg:hidden h-20" /> */}
            </div>
        );
    }

    // Traveler Information Step
    return (
        <div className="min-h-screen">
            <BookingSteps currentStep={currentStep} />

            <TopMobileSection ticket={bookingData}>
                <BackWardButtonWithDirections />
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-semibold capitalize ">
                        {t("booking.enter_traveler_information")}
                    </h1>
                    <div className="capitalize flex items-center gap-2 text-xs text-muted-foreground truncate">
                        <span>
                            {t(
                                `ticket_class.${String(
                                    searchParams.class
                                ).toLocaleLowerCase()}`
                            )}
                        </span>{" "}
                        |{" "}
                        <div className="flex items-center gap-2">
                            {searchParams.origin}{" "}
                            <ChevronBasedOnLanguage icon="arrow" size="3" />
                            {searchParams.destination}
                        </div>
                    </div>
                </div>
            </TopMobileSection>

            <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-6 lg:py-8 mt-15 sm:mt-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="flex-1 space-y-6">
                        {!isLogged && <TravelerLoginSection />}

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:block">
                                        <BackWardButtonWithDirections />
                                    </div>
                                    <h2 className="rtl:text-right font-semibold text-xl">
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
                                        key={`traveler-${traveler.travelerNumber}`}
                                        ref={(el) => {
                                            if (el)
                                                travelerRefs.current[index] =
                                                    el;
                                        }}
                                        travelerNumber={traveler.travelerNumber}
                                        travelerType={traveler.travelerType}
                                        isLoggedIn={isLogged}
                                        onValidationChange={(isValid) => {
                                            // Optional callback
                                        }}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Baggage and Meals Section */}
                        <section>
                            <h2 className="mb-4 rtl:text-right font-semibold text-xl">
                                {t("booking.add_on")}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaggageDialog
                                    cabinLuggage={bookingData.CabinLuggage}
                                    includedBaggage={
                                        bookingData.BaggageAllowance
                                    }
                                />
                                <MealsDialog />
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <ContactInformation
                                ref={contactInfoRef}
                                onValidationChange={(isValid) => {
                                    // Optional callback
                                }}
                            />
                        </section>

                        <section>
                            <InsuranceSelection
                                options={insurancePlans}
                                selectedInsurance={selectedInsurance}
                                onInsuranceChange={handleInsuranceChange}
                                totalPassengers={totalPassengers}
                            />
                        </section>
                    </div>

                    {/* Fare Summary Sidebar - Desktop Only */}
                    <div className="hidden lg:block lg:w-96">
                        <FareSummarySidebar
                            ticket={bookingData}
                            totalPrice={dynamicTotal}
                            basePrice={bookingData.BasePrice}
                            taxes={bookingData.Taxes + addOnsTotal}
                            insuranceTotal={insuranceTotal}
                            currency={bookingData.SITECurrencyType}
                            fareType={bookingData.FareType}
                            refundable={bookingData.Refundable}
                            holdBooking={bookingData.HoldBooking}
                            segments={segments}
                            onProceedToPayment={handleProceedToPayment}
                        />
                    </div>
                </div>
            </div>

            {/* <InsuranceSelection options={insurancePlans} /> */}

            {/* Sticky Bottom Bar - Mobile Only */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
                <div className="p-3">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="text-sm text-gray-950 font-semibold">
                            {t("booking.total_fare")}
                        </div>
                        <div className="text-2xl text-accent-500 font-semibold">
                            {formatPrice(dynamicTotal)}
                        </div>
                    </div>
                    <Button
                        onClick={handleProceedToPayment}
                        className="btn-primary"
                        size="lg"
                    >
                        {t("booking.proceed_to_payment")}
                        <ChevronBasedOnLanguage size="5" />
                    </Button>
                </div>
            </div>

            {/* Spacer for mobile sticky button */}
            <div className="lg:hidden h-32" />
        </div>
    );
}

function TicketExpired() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <h2 className="text-xl mb-2">Ticket expired or not found</h2>
                <p className="text-muted-foreground">
                    Please search for a new flight
                </p>
                <BackwardButton>
                    <Button>Back</Button>
                </BackwardButton>
            </div>
        </div>
    );
}

export function TopMobileSection({ ticket, children }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const f = useTranslations("Flight");
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {children}
                    <div className="text-right shrink-0 rtl:text-left flex items-end">
                        <div className="text-lg text-primary-600 dark:text-primary-400">
                            <FlightDetailsDialog
                                ticket={ticket}
                                isOpen={showDetailsDialog}
                                onClose={() =>
                                    setShowDetailsDialog(!showDetailsDialog)
                                }
                                withContinue={false}
                                trigger={{
                                    title: f("booking.details"),
                                    icon: <Ticket className="w-4 h-4" />,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
