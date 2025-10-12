"use client";
import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
import BookingSteps from "./BookingSteps";
import TravelerLoginSection from "./TravelerLoginSection";
import TravelerInformationSection from "./TravelerInformationSection";
import ContactInformation from "./ContactInformation";
import FareSummarySidebar from "./FareSummarySidebar";
import BaggageDialog from "./BaggageDialog";
import MealsDialog from "./MealsDialog";
import PaymentSection from "./PaymentSection";
import { BackWardButtonWithDirections } from "../flightSearchNavWrapper/BackwardButton";
import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
import { useCurrency } from "@/app/_context/CurrencyContext";

export default function BookingPage({
    bookingData,
    searchParams,
    onBack = {},
    isLogged,
}) {
    const [currentStep, setCurrentStep] = useState(2);
    const [isLoggedIn] = useState(false);
    const [travelerValidations, setTravelerValidations] = useState({});

    // Add-ons state
    const [selectedBaggage, setSelectedBaggage] = useState(null);
    const [baggagePrice, setBaggagePrice] = useState(0);
    const [selectedMeal, setSelectedMeal] = useState("none");
    const [mealPrice, setMealPrice] = useState(0);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const contactInfoRef = useRef(null);
    const travelerRefs = useRef([]);

    const { formatPrice } = useCurrency();

    const { segments } = bookingData;

    if (!segments || segments.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-xl mb-2">
                        Ticket expired or not found
                    </h2>
                    <p className="text-muted-foreground">
                        Please search for a new flight
                    </p>
                    {onBack && (
                        <Button
                            onClick={onBack}
                            className="mt-6"
                            variant="outline"
                        >
                            <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            Back to Search
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    const origin = segments[0].Origin;
    const destination = segments[segments.length - 1].Destination;
    const totalPassengers =
        (searchParams?.ADT || 1) +
        (searchParams?.CHD || 0) +
        (searchParams?.INF || 0);

    const dynamicTotal = bookingData.TotalPrice + baggagePrice + mealPrice;

    const handleTravelerValidationChange = (travelerNumber, isValid) => {
        setTravelerValidations((prev) => ({
            ...prev,
            [travelerNumber]: isValid,
        }));
    };

    const handleBaggageChange = (index, price) => {
        setSelectedBaggage(index);
        setBaggagePrice(price);
    };

    const handleMealChange = (mealId, price) => {
        setSelectedMeal(mealId);
        setMealPrice(price);
    };

    const handleProceedToPayment = () => {
        // Trigger validation on all travelers
        let allValid = true;

        travelerRefs.current.forEach((ref) => {
            if (ref && ref.triggerValidation) {
                const isValid = ref.triggerValidation();
                if (!isValid) allValid = false;
            }
        });

        // Trigger contact info validation
        if (
            contactInfoRef.current &&
            contactInfoRef.current.triggerValidation
        ) {
            const isContactValid = contactInfoRef.current.triggerValidation();
            if (!isContactValid) allValid = false;
        }

        if (!allValid) {
            // Scroll to top to show errors
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
        alert("Payment confirmed! Booking ID: BK" + Date.now());
    };

    // Payment Step
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <BookingSteps currentStep={currentStep} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="flex-1 space-y-6">
                            <Button
                                onClick={handleBackToInformation}
                                variant="outline"
                                className="mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                Back to Traveler Information
                            </Button>

                            <PaymentSection
                                totalAmount={dynamicTotal}
                                currency={bookingData.SITECurrencyType}
                                onConfirmPayment={handleConfirmPayment}
                            />
                        </div>

                        <div className="hidden lg:block lg:w-96">
                            <FareSummarySidebar
                                ticket={bookingData}
                                totalPrice={dynamicTotal}
                                basePrice={bookingData.BasePrice}
                                taxes={
                                    bookingData.Taxes + baggagePrice + mealPrice
                                }
                                currency={bookingData.SITECurrencyType}
                                fareType={bookingData.FareType}
                                refundable={bookingData.Refundable}
                                holdBooking={bookingData.HoldBooking}
                                segments={segments}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50 p-4">
                    <div className="text-xl text-primary-600 dark:text-primary-400 text-center mb-2">
                        Total: {bookingData.SITECurrencyType}{" "}
                        {dynamicTotal.toFixed(2)}
                    </div>
                </div>
                <div className="lg:hidden h-20" />
            </div>
        );
    }

    // Traveler Information Step
    return (
        <div className="min-h-screen">
            <BookingSteps currentStep={currentStep} />

            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-4">
                        {onBack && <BackWardButtonWithDirections />}
                        <div className="flex-1 min-w-0 ">
                            <FlightDetailsDialog ticket={bookingData} />
                            <p className="text-xs text-muted-foreground truncate ">
                                <h1 className="text-lg font-semibold capitalize ">
                                    Travelers Information
                                </h1>
                                {/* {searchParams?.depart_date} */}
                                <div className="capitalize flex items-center gap-2">
                                    <span>{searchParams.class}</span> |{" "}
                                    <div className="flex items-center gap-2">
                                        {searchParams.origin}{" "}
                                        <ChevronBasedOnLanguage
                                            icon="arrow"
                                            size="3"
                                        />
                                        {searchParams.destination}
                                    </div>
                                </div>
                            </p>
                        </div>
                        <div className="text-right shrink-0 rtl:text-left flex items-end">
                            <div className="text-lg text-primary-600 dark:text-primary-400 ">
                                <FlightDetailsDialog
                                    ticket={bookingData}
                                    isOpen={showDetailsDialog}
                                    onClose={() =>
                                        setShowDetailsDialog(!showDetailsDialog)
                                    }
                                    withContinue={false}
                                    trigger={{
                                        title: "Details",
                                        icon: <Info className="w-4 h-4" />,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-6 lg:py-8 mt-15 sm:mt-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="flex-1 space-y-6">
                        {!isLogged && <TravelerLoginSection />}

                        <section>
                            <div className="flex items-center justify-between mb-4  ">
                                <h2 className="rtl:text-right font-semibold text-xl">
                                    Traveler Information
                                </h2>
                                <Badge variant="outline">
                                    {String(totalPassengers).padStart("2", 0)}{" "}
                                    {totalPassengers === 1
                                        ? "Traveler"
                                        : "Travelers"}
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                {Array.from({
                                    length: searchParams?.ADT || 1,
                                }).map((_, index) => (
                                    <TravelerInformationSection
                                        key={`adult-${index}`}
                                        ref={(el) => {
                                            if (el)
                                                travelerRefs.current[index] =
                                                    el;
                                        }}
                                        travelerNumber={index + 1}
                                        travelerType="Adult"
                                        isLoggedIn={isLoggedIn}
                                        onValidationChange={(isValid) =>
                                            handleTravelerValidationChange(
                                                index + 1,
                                                isValid
                                            )
                                        }
                                    />
                                ))}
                                {Array.from({
                                    length: searchParams?.CHD || 0,
                                }).map((_, index) => {
                                    const refIndex =
                                        (searchParams?.ADT || 1) + index;
                                    return (
                                        <TravelerInformationSection
                                            key={`child-${index}`}
                                            ref={(el) => {
                                                if (el)
                                                    travelerRefs.current[
                                                        refIndex
                                                    ] = el;
                                            }}
                                            travelerNumber={refIndex + 1}
                                            travelerType="Child"
                                            isLoggedIn={isLoggedIn}
                                            onValidationChange={(isValid) =>
                                                handleTravelerValidationChange(
                                                    refIndex + 1,
                                                    isValid
                                                )
                                            }
                                        />
                                    );
                                })}
                                {Array.from({
                                    length: searchParams?.INF || 0,
                                }).map((_, index) => {
                                    const refIndex =
                                        (searchParams?.ADT || 1) +
                                        (searchParams?.CHD || 0) +
                                        index;
                                    return (
                                        <TravelerInformationSection
                                            key={`infant-${index}`}
                                            ref={(el) => {
                                                if (el)
                                                    travelerRefs.current[
                                                        refIndex
                                                    ] = el;
                                            }}
                                            travelerNumber={refIndex + 1}
                                            travelerType="Infant"
                                            isLoggedIn={isLoggedIn}
                                            onValidationChange={(isValid) =>
                                                handleTravelerValidationChange(
                                                    refIndex + 1,
                                                    isValid
                                                )
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </section>

                        {/* Baggage and Meals Section */}
                        <section>
                            <h2 className="mb-4 rtl:text-right font-semibold text-xl">
                                Add-ons
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaggageDialog
                                    cabinLuggage={bookingData.CabinLuggage}
                                    includedBaggage={
                                        bookingData.BaggageAllowance
                                    }
                                    selectedBaggage={selectedBaggage}
                                    onBaggageChange={handleBaggageChange}
                                />
                                <MealsDialog
                                    selectedMeal={selectedMeal}
                                    onMealChange={handleMealChange}
                                />
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <ContactInformation
                                ref={contactInfoRef}
                                onValidationChange={(isValid) => {
                                    // Optional: track contact validation
                                }}
                            />
                        </section>
                    </div>

                    {/* Fare Summary Sidebar - Desktop Only */}
                    <div className="hidden lg:block lg:w-96">
                        <FareSummarySidebar
                            ticket={bookingData}
                            totalPrice={dynamicTotal}
                            basePrice={bookingData.BasePrice}
                            taxes={bookingData.Taxes + baggagePrice + mealPrice}
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

            {/* Sticky Bottom Bar - Mobile Only */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="text-sm text-muted-foreground">
                            Total Amount
                        </div>
                        <div className="text-2xl text-accent-500 font-semibold">
                            {/* {bookingData.SITECurrencyType}{" "}
                            {dynamicTotal.toFixed(2)} */}
                            {formatPrice(dynamicTotal)}
                        </div>
                    </div>
                    <Button
                        onClick={handleProceedToPayment}
                        className="btn-primary"
                        size="lg"
                    >
                        Proceed to Payment
                        <ArrowRight className="w-4 h-4 ltr:ml-2 rtl:mr-2" />
                    </Button>
                </div>
            </div>

            {/* Spacer for mobile sticky button */}
            <div className="lg:hidden h-32" />
        </div>
    );
}
