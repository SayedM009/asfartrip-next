"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff, Wallet, Users, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import FlightSegment from "../molecules/FlightSegment";
import PricingBreakdown from "../molecules/PricingBreakdown";
import CardPaymentDetails from "../molecules/CardPaymentDetails";
import PassengerList from "../molecules/PassengerList";
import ContactInfo from "../molecules/ContactInfo";
import PaymentDetails from "../molecules/PaymentDetails";

/**
 * Booking Summary - Main content showing all booking details
 * @param {Object} props
 * @param {Object} props.booking - Complete booking data
 */
export default function BookingSummary({ booking }) {
    const t = useTranslations("FlightStatus");
    const { segments, pricing, passengers, contact, payment } = booking;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
        >
            {/* Flight Details Section */}
            <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 sm:p-10">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-lg shadow-accent-500/30">
                        <PlaneTakeoff className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {t('flight_details')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {segments?.length || 0} {segments?.length === 1 ? 'Segment' : 'Segments'}
                        </p>
                    </div>
                </div>
                
                {/* Flight Segments */}
                <div className="space-y-6">
                    {segments && segments.length > 0 ? (
                        segments.map((segment, index) => (
                            <FlightSegment 
                                key={index} 
                                segment={segment} 
                                index={index} 
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('no_data')}</p>
                    )}
                </div>
            </section>
            
            {/* Pricing & Payment Section */}
            {(pricing || payment) && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Always show PricingBreakdown if pricing data exists */}
                    {pricing && (
                        <PricingBreakdown 
                            pricing={pricing} 
                            paymentAmount={payment?.amount} 
                        />
                    )}
                    
                    {/* Show CardPaymentDetails if card data exists, otherwise show PaymentDetails */}
                    {payment && (
                        payment?.card_type || payment?.card_last4 ? (
                            <CardPaymentDetails payment={payment} />
                        ) : (
                            <PaymentDetails payment={payment} />
                        )
                    )}
                </section>
            )}
            
            {/* Passengers & Contact Section */}
            {passengers && passengers.length > 0 && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PassengerList passengers={passengers} />
                    {contact && <ContactInfo contact={contact} />}
                </section>
            )}
        </motion.div>
    );
}
