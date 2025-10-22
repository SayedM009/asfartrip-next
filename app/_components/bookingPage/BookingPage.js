"use client";
import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { BackWardButtonWithDirections } from "../flightSearchNavWrapper/BackwardButton";
import BookingSteps from "./BookingSteps";
import TravelerLoginSection from "./TravelerLoginSection";
import TravelerInformationSection from "./TravelerInformationSection";
import ContactInformation from "./ContactInformation";
import FareSummarySidebar from "./FareSummarySidebar";
import PaymentSection from "./PaymentSection";
import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
import useBookingStore from "@/app/_store/bookingStore";
import { useTranslations } from "next-intl";
import { InsuranceSelection } from "./InsuranceSelection";
import { savePassengers } from "@/app/_libs/flightService";
import TimeoutPopup from "../TimeoutPopup";
import AddOn from "./AddOn";
import TopMobileSection from "./TopMobileSection";
import TicketExpired from "./TicketExpired";

export default function BookingPage({ isLogged, cart: initialCart, userId }) {
    const [currentStep, setCurrentStep] = useState(2);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const t = useTranslations("Flight");
    const { formatPrice } = useCurrency();
    const contactInfoRef = useRef(null);
    const travelerRefs = useRef([]);

    // ✅ Zustand bindings
    const {
        ticket,
        searchInfo,
        travelers,
        addOns,
        insurancePlans,
        selectedInsurance,
        getTotalPrice,
        getTotalPassengers,
        getInsuranceTotal,
        setSelectedInsurance,
        setInsurancePlans,
        setUserId,
        setCart,
        setTicket,
        setSearchInfo,
        setBookingData,
        bookingReference,
        gateway,
        searchURL,
    } = useBookingStore();

    // ✅ إعداد أولي للبيانات
    useEffect(() => {
        if (isLogged && userId) setUserId(userId);
    }, [isLogged, userId, setUserId]);

    useEffect(() => {
        if (initialCart) {
            setCart(initialCart.CartData);
            if (initialCart.Premium) setInsurancePlans(initialCart.Premium);
        }
    }, [initialCart, setCart, setInsurancePlans]);

    useEffect(() => {
        if (insurancePlans?.length > 0 && !selectedInsurance) {
            setSelectedInsurance({
                quote_id: 0,
                scheme_id: 0,
                name: "No Insurance",
                premium: 0,
            });
        }
    }, [insurancePlans, selectedInsurance, setSelectedInsurance]);

    // ✅ البيانات الجاهزة
    const totalPassengers = getTotalPassengers();
    const dynamicTotal = getTotalPrice();
    const segments =
        ticket?.segments ||
        ticket?.onward?.segments ||
        ticket?.return?.segments ||
        [];

    if (!segments?.length) return <TicketExpired />;

    // ✅ الخطوات
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

    const handleConfirmPayment = () => {
        try {
            if (gateway?.ifrurl) {
                window.location.href = gateway.ifrurl;
            } else {
                throw new Error("Payment gateway URL not found");
            }
        } catch (error) {
            setErrorMessage(error.message || "Failed to process payment");
            setErrorModalOpen(true);
        }
    };

    // Payment Step
    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-transparent">
                <BookingSteps currentStep={3} />
                <div className="max-w-7xl mx-auto py-6 lg:py-8 flex flex-col lg:flex-row gap-8">
                    <PaymentSection
                        totalAmount={dynamicTotal}
                        onConfirmPayment={handleConfirmPayment}
                        backTo={() => setCurrentStep(2)}
                        loading={loading}
                        ticket={ticket}
                        gateway={gateway}
                        bookingReference={bookingReference}
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
                                    key={traveler.travelerNumber}
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

                    <InsuranceSelection
                        options={insurancePlans}
                        selectedInsurance={selectedInsurance}
                        onInsuranceChange={setSelectedInsurance}
                        totalPassengers={totalPassengers}
                    />
                    <div className="h-20 sm:hidden" />
                </div>

                <div className="hidden lg:block lg:w-96">
                    <FareSummarySidebar
                        onProceedToPayment={handleProceedToPayment}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
                <div className="p-3">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="text-sm font-semibold">
                            {t("booking.total_fare")}
                        </div>
                        <div className="text-2xl text-accent-500 font-semibold">
                            {formatPrice(dynamicTotal)}
                        </div>
                    </div>
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

// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useCurrency } from "@/app/_context/CurrencyContext";
// import { BackWardButtonWithDirections } from "../flightSearchNavWrapper/BackwardButton";
// import BookingSteps from "./BookingSteps";
// import TravelerLoginSection from "./TravelerLoginSection";
// import TravelerInformationSection from "./TravelerInformationSection";
// import ContactInformation from "./ContactInformation";
// import FareSummarySidebar from "./FareSummarySidebar";
// import PaymentSection from "./PaymentSection";
// import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
// import useBookingStore from "@/app/_store/bookingStore";
// import { useTranslations } from "next-intl";
// import { InsuranceSelection } from "./InsuranceSelection";
// import { savePassengers } from "@/app/_libs/flightService";
// import TimeoutPopup from "../TimeoutPopup";
// import AddOn from "./AddOn";
// import TopMobileSection from "./TopMobileSection";
// import TicketExpired from "./TicketExpired";

// export default function BookingPage({ isLogged, cart: initialCart, userId }) {
//     const [currentStep, setCurrentStep] = useState(2);
//     const [initialized, setInitialized] = useState(false);
//     const contactInfoRef = useRef(null);
//     const travelerRefs = useRef([]);
//     const { formatPrice } = useCurrency();

//     const t = useTranslations("Flight");

//     const {
//         setCart,
//         selectedInsurance,
//         setSelectedInsurance,
//         getInsuranceTotal,
//         getTotalPassengers,
//         insurancePlans,
//         setInsurancePlans,
//         setUserId,
//         setBookingData,
//         bookingReference,
//         gateway,
//         searchURL,
//     } = useBookingStore();

//     const bookingTicket = useBookingStore((state) => state.ticket);
//     const bookingSearch = useBookingStore((state) => state.searchInfo);
//     const setTicket = useBookingStore((state) => state.setTicket);
//     const setSearchInfo = useBookingStore((state) => state.setSearchInfo);
//     const travelers = useBookingStore((state) => state.travelers);
//     const getTotalPrice = useBookingStore((state) => state.getTotalPrice);

//     const [errorModalOpen, setErrorModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (isLogged && userId) {
//             setUserId(userId);
//         }
//     }, [isLogged, userId, setUserId]);

//     useEffect(() => {
//         if (
//             !initialized &&
//             bookingTicket &&
//             Object.keys(bookingTicket).length > 0
//         ) {
//             setTicket(bookingTicket);
//             if (bookingSearch && Object.keys(bookingSearch).length > 0) {
//                 setSearchInfo(bookingSearch);
//             }
//             setInitialized(true);
//         }
//     }, [bookingTicket, bookingSearch, initialized, setTicket, setSearchInfo]);

//     useEffect(() => {
//         if (insurancePlans?.length > 0 && !selectedInsurance) {
//             const noInsuranceOption = {
//                 quote_id: 0,
//                 scheme_id: 0,
//                 name: "No Insurance",
//                 premium: 0,
//             };
//             setSelectedInsurance(noInsuranceOption);
//         }
//     }, [insurancePlans, selectedInsurance, setSelectedInsurance]);

//     useEffect(() => {
//         if (initialCart) {
//             setCart(initialCart.CartData);
//             if (initialCart.Premium) {
//                 setInsurancePlans(initialCart.Premium);
//             }
//         }
//     }, [initialCart, setCart, setInsurancePlans]);

//     const handleInsuranceChange = (insurance) => {
//         setSelectedInsurance(insurance);
//     };

//     const insuranceTotal = getInsuranceTotal();
//     const totalPassengers = getTotalPassengers();
//     const bookingData = bookingTicket;
//     const searchParams = bookingSearch;

//     const segments =
//         bookingData?.segments ||
//         bookingData?.onward?.segments ||
//         bookingData?.return?.segments ||
//         [];
//     if (!segments || segments.length === 0) return <TicketExpired />;

//     const dynamicTotal = getTotalPrice();

//     const handleProceedToPayment = async () => {
//         let allValid = true;

//         travelerRefs.current.forEach((ref) => {
//             if (ref && ref.triggerValidation) {
//                 const isValid = ref.triggerValidation();
//                 if (!isValid) allValid = false;
//             }
//         });

//         if (
//             contactInfoRef.current &&
//             contactInfoRef.current.triggerValidation
//         ) {
//             const isContactValid = contactInfoRef.current.triggerValidation();
//             if (!isContactValid) allValid = false;
//         }

//         if (!allValid) {
//             window.scrollTo({ top: 300, behavior: "smooth" });
//             return;
//         }

//         setLoading(true);
//         try {
//             const { isDataModified, setDataModified } =
//                 useBookingStore.getState();
//             if (isDataModified || !bookingReference || !gateway) {
//                 // استدعاء savePassengers فقط إذا تم تعديل البيانات أو لم يكن هناك bookingReference
//                 const finalPayload = useBookingStore
//                     .getState()
//                     .getFinalPayload();
//                 const data = await savePassengers(finalPayload);
//                 if (
//                     data.status === "success" &&
//                     data.booking_reference &&
//                     data.gateway
//                 ) {
//                     setBookingData(data);
//                     setDataModified(false); // إعادة تعيين بعد النجاح
//                     setCurrentStep(3);
//                     window.scrollTo({ top: 0, behavior: "smooth" });
//                 } else {
//                     throw new Error(
//                         data.message || "Failed to save passengers"
//                     );
//                 }
//             } else {
//                 // إذا لم يتم تعديل البيانات، انتقل مباشرة إلى الخطوة 3
//                 setCurrentStep(3);
//                 window.scrollTo({ top: 0, behavior: "smooth" });
//             }
//         } catch (error) {
//             console.error("Save passengers error:", error.message, {
//                 session_id: useBookingStore.getState().sessionId,
//                 temp_id: useBookingStore.getState().tempId,
//             });
//             setErrorMessage(error.message || "Failed to proceed to payment");
//             setErrorModalOpen(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBackToInformation = () => {
//         setCurrentStep(2);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     const handleConfirmPayment = async () => {
//         setLoading(true);
//         try {
//             if (gateway?.ifrurl) {
//                 window.location.href = gateway.ifrurl; // توجيه المستخدم إلى رابط الدفع
//             } else {
//                 throw new Error("Payment gateway URL not found");
//             }
//         } catch (error) {
//             console.error("Confirm payment error:", error.message);
//             setErrorMessage(error.message || "Failed to process payment");
//             setErrorModalOpen(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (currentStep === 3) {
//         return (
//             <div className="min-h-screen bg-gray-50 dark:bg-transparent">
//                 <BookingSteps currentStep={currentStep} />
//                 <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-6 lg:py-8">
//                     <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between">
//                         <PaymentSection
//                             totalAmount={dynamicTotal}
//                             currency={bookingData.SITECurrencyType}
//                             onConfirmPayment={handleConfirmPayment}
//                             backTo={handleBackToInformation}
//                             ticket={bookingData}
//                             bookingReference={bookingReference}
//                             gateway={gateway}
//                             loading={loading}
//                         />
//                         <div className="hidden lg:block lg:w-96">
//                             <FareSummarySidebar />
//                         </div>
//                     </div>
//                 </div>
//                 {errorModalOpen && (
//                     <div className="modal-overlay">
//                         <div className="modal-content">
//                             <h3>{t("Flight.ticket_details.booking_failed")}</h3>
//                             <p>{errorMessage}</p>
//                             <button onClick={() => setErrorModalOpen(false)}>
//                                 {t("Close")}
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen">
//             <BookingSteps currentStep={currentStep} />
//             <TopMobileSection ticket={bookingData}>
//                 <BackWardButtonWithDirections />
//                 <div className="flex-1 min-w-0">
//                     <h1 className="text-lg font-semibold capitalize ">
//                         {t("booking.enter_traveler_information")}
//                     </h1>
//                     <div className="capitalize flex items-center gap-2 text-xs text-muted-foreground truncate">
//                         <span>
//                             {t(
//                                 `ticket_class.${String(
//                                     searchParams.class
//                                 ).toLocaleLowerCase()}`
//                             )}
//                         </span>{" "}
//                         |{" "}
//                         <div className="flex items-center gap-2">
//                             {searchParams.origin}{" "}
//                             <ChevronBasedOnLanguage icon="arrow" size="3" />
//                             {searchParams.destination}
//                         </div>
//                     </div>
//                 </div>
//             </TopMobileSection>
//             <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-6 lg:py-8 mt-15 sm:mt-auto">
//                 <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//                     <div className="flex-1 space-y-6">
//                         {!isLogged && <TravelerLoginSection />}
//                         <section>
//                             <div className="flex items-center justify-between mb-4">
//                                 <div className="flex items-center gap-4">
//                                     <div className="hidden sm:block">
//                                         <BackWardButtonWithDirections />
//                                     </div>
//                                     <h2 className="rtl:text-right font-semibold text-xl">
//                                         {t("booking.traveler_information")}
//                                     </h2>
//                                 </div>
//                                 <Badge variant="outline">
//                                     {String(totalPassengers).padStart(2, "0")}{" "}
//                                     {totalPassengers === 1
//                                         ? t("booking.traveler")
//                                         : t("booking.travelers")}
//                                 </Badge>
//                             </div>
//                             <div className="space-y-4">
//                                 {travelers.map((traveler, index) => (
//                                     <TravelerInformationSection
//                                         key={`traveler-${traveler.travelerNumber}`}
//                                         ref={(el) => {
//                                             if (el)
//                                                 travelerRefs.current[index] =
//                                                     el;
//                                         }}
//                                         travelerNumber={traveler.travelerNumber}
//                                         travelerType={traveler.travelerType}
//                                         isLoggedIn={isLogged}
//                                         onValidationChange={(isValid) => {}}
//                                     />
//                                 ))}
//                             </div>
//                         </section>
//                         <section>
//                             <AddOn />
//                         </section>
//                         <section>
//                             <ContactInformation
//                                 ref={contactInfoRef}
//                                 onValidationChange={(isValid) => {}}
//                             />
//                         </section>
//                         <section>
//                             <InsuranceSelection
//                                 options={insurancePlans}
//                                 selectedInsurance={selectedInsurance}
//                                 onInsuranceChange={handleInsuranceChange}
//                                 totalPassengers={totalPassengers}
//                             />
//                         </section>
//                     </div>
//                     <div className="hidden lg:block lg:w-96">
//                         <FareSummarySidebar
//                             onProceedToPayment={handleProceedToPayment}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
//                 <div className="p-3">
//                     <div className="flex items-center justify-between gap-4 mb-3">
//                         <div className="text-sm text-gray-950 font-semibold">
//                             {t("booking.total_fare")}
//                         </div>
//                         <div className="text-2xl text-accent-500 font-semibold">
//                             {formatPrice(dynamicTotal)}
//                         </div>
//                     </div>
//                     <Button
//                         onClick={handleProceedToPayment}
//                         className="btn-primary rtl:flex-row-reverse ltr:flex-row-reverse"
//                         size="lg"
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                         ) : (
//                             <ChevronBasedOnLanguage size="5" />
//                         )}
//                         {t("booking.proceed_to_payment")}
//                     </Button>
//                 </div>
//             </div>
//             <div className="lg:hidden h-32" />
//             {errorModalOpen && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <h3>Booking Failed</h3>
//                         {/* <h3>{t("Flight.ticket_details.booking_failed")}</h3> */}
//                         <p>{errorMessage}</p>
//                         <div className="flex gap-4">
//                             <Button onClick={() => handleProceedToPayment()}>
//                                 {t("Retry")}
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 onClick={() =>
//                                     (window.location.href = "/flights")
//                                 }
//                             >
//                                 New Search
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 onClick={() => setErrorModalOpen(false)}
//                             >
//                                 close
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             <TimeoutPopup timeoutMinutes={15} redirectLink={searchURL} />
//         </div>
//     );
// }
