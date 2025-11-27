"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import useBookingStore from "@/app/_modules/flight/booking/store/bookingStore";
import StatusHero from "../organisms/StatusHero";
import BookingSummary from "../organisms/BookingSummary";
// import ActionButtons from "../molecules/ActionButtons";

/**
 * Flight Status Page Template
 * @param {Object} props
 * @param {Object} props.bookingData - Booking data from API
 * @param {string} props.status - Page status (success, pending, failed)
 * @param {string} props.bookingRef - Booking reference
 * @param {string} props.pnr - PNR code
 * @param {Object} props.paymentInfo - Payment gateway info from URL params
 */
export default function FlightStatusPage({ 
    bookingData, 
    status, 
    bookingRef, 
    paymentInfo 
}) {
    const t = useTranslations("FlightStatus");
    const { travelers } = useBookingStore();
    
    // Parse payment_success JSON string from bookingData
    let paymentSuccessData = null;
    try {
        if (bookingData?.BookingData?.payment_success) {
            paymentSuccessData = JSON.parse(bookingData.BookingData.payment_success);
        }
    } catch (error) {
        console.error("Failed to parse payment_success:", error);
    }
    

    
    // Transform booking data to component format
    // Extract segments - supports both Round trip and One way
    let segments = [];
    const pnr = bookingData?.BookingData?.booking_no || '';
    
    if (bookingData?.BookingData?.response?.onward) {
        // Round trip: has onward and possibly return
        const onwardSegments = bookingData.BookingData.response.onward.segments || [];
        const returnSegments = bookingData.BookingData.response.return?.segments || [];
        segments = [...onwardSegments, ...returnSegments];
    } else {
        // One way: segments directly in response
        segments = bookingData?.BookingData?.response?.segments || [];
    }

    
    const baggageAllowance = bookingData?.BookingData?.response?.BaggageAllowance?.[0];
    
    // Add baggage to segments
    const segmentsWithBaggage = segments.map(seg => ({
        ...seg,
        BaggageAllowance: baggageAllowance
    }));
    
    // Calculate add-ons from bookingData
    const extraTotal = parseFloat(bookingData?.BookingData?.extra_total || 0);
    const luggageTotal = parseFloat(bookingData?.BookingData?.travelfusion_luggage_total || 0);
    const insurancePremium = parseFloat(bookingData?.BookingData?.insurance_premium || 0);
    const addOnsTotal = extraTotal + luggageTotal + insurancePremium;
    
    // Get payment details with priority: URL params > payment_success > bookingData
    const cardType = paymentInfo?.card_type || 
                     paymentSuccessData?.card?.type || 
                     null;
    
    const cardLast4 = paymentInfo?.card_last4 || 
                      paymentSuccessData?.card?.last4 || 
                      null;
    
    const transactionDate = paymentInfo?.transaction_date || 
                           paymentSuccessData?.transaction?.date || 
                           bookingData?.BookingData?.issued_date;
    
    const actualAmount = paymentInfo?.amount || 
                        paymentSuccessData?.amount || 
                        bookingData?.BookingData?.TotalPrice || 
                        0;
    
    const paymentStatus = paymentInfo?.status || 
                         paymentSuccessData?.status?.text || 
                         bookingData?.BookingData?.payment_res || 
                         'N/A';
    
    const transactionId = paymentInfo?.transaction_id || 
                         paymentSuccessData?.transaction?.ref || 
                         bookingData?.BookingData?.transaction_id || 
                         'N/A';
    
    const paymentGateway = paymentInfo?.gateway || 
                          bookingData?.BookingData?.payment_provider || 
                          (paymentSuccessData ? 'Telr' : 'N/A');
    
    const booking = {
        segments: segmentsWithBaggage,
        pricing: {
            baseFare: parseFloat(bookingData?.BookingData?.BasePrice || 0),
            taxes: parseFloat(bookingData?.BookingData?.TaxPrice || 0),
            addOns: addOnsTotal,
            total: parseFloat(actualAmount),
            currency: paymentInfo?.currency || 
                     paymentSuccessData?.currency || 
                     bookingData?.BookingData?.SITECurrencyType || 
                     'AED',
        },
        passengers: travelers || [],
        contact: {
            name: `${bookingData?.BookingData?.GUEST_FIRSTNAME || ''} ${bookingData?.BookingData?.GUEST_LASTNAME || ''}`.trim(),
            email: bookingData?.BookingData?.GUEST_EMAIL,
            phone: bookingData?.BookingData?.GUEST_PHONE,
        },
        payment: {
            gateway: paymentGateway,
            transaction_id: transactionId,
            method: cardType || bookingData?.BookingData?.payment_method || 'N/A',
            status: paymentStatus,
            payment_status: paymentStatus,
            amount: parseFloat(actualAmount),
            currency: paymentInfo?.currency || 
                     paymentSuccessData?.currency || 
                     bookingData?.BookingData?.SITECurrencyType || 
                     'AED',
            date: transactionDate,
            card_type: cardType,
            card_last4: cardLast4,
            transaction_date: transactionDate,
        },
    };
    
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b my-6 md:my-12">
            
            
            {/* Content */}
            <div className="relative z-10 container mx-auto ">
                {/* Status Hero */}
                <StatusHero 
                    status={status} 
                    bookingRef={bookingRef} 
                    pnr={pnr} 
                />
                
                {/* Divider */}
                <motion.div
                    className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent w-3/4 mx-auto my-2 opacity-30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                />
                
                {/* Booking Summary */}
                <BookingSummary booking={booking} />
                
                {/* Action Buttons */}
                {/* <ActionButtons bookingRef={bookingRef} /> */}
                
                {/* Footer */}
                {/* <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                    {t('powered_by')}
                </div> */}
                <div className="h-12 md:hidden" />
            </div>
        </div>
    );
}
