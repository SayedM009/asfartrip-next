"use client";

import { motion } from "framer-motion";
import {
    PlaneTakeoff,
    PlaneLanding,
    User,
    Calendar,
    Clock4,
    Wallet,
    Luggage,
    Building2,
    ShieldCheck,
    CreditCard,
    Mail,
    Phone,
    AlertTriangle,
} from "lucide-react";

export default function FlightSummary({ booking }) {
    const data = booking?.BookingData?.response || {};
    const traveler = booking?.BookingData || {};
    const segments = data.segments || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-8 mb-10 backdrop-blur-xl"
        >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <PlaneTakeoff className="w-6 h-6 text-accent-500" />
                    Flight Booking Summary
                </h2>
                <div className="text-sm text-gray-500">
                    Booking Ref <b>{booking?.BookingReference}</b> | PNR{" "}
                    <b>{data.booking_no || "N/A"}</b>
                </div>
            </div>

            {/* ROUTE TIMELINE */}
            <div className="relative border-l-2 border-accent-500/30 ml-4 mb-10">
                {segments.map((seg, i) => (
                    <motion.div
                        key={i}
                        className="pl-6 pb-8 relative"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent-500"></span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {seg.OriginCity} → {seg.DestinationCity}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {seg.Carrier} {seg.FlightNumber} ·{" "}
                                    {seg.AircraftInfo}
                                </p>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                                <p className="text-sm text-gray-500">
                                    Duration
                                </p>
                                <p className="font-medium">{seg.Duration}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <PlaneTakeoff className="w-4 h-4 text-accent-500" />{" "}
                                {seg.OriginAirport}
                            </div>
                            <div className="flex items-center gap-2">
                                <PlaneLanding className="w-4 h-4 text-accent-500" />{" "}
                                {seg.DestinationAirport}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent-500" />{" "}
                                {new Date(seg.DepartureTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock4 className="w-4 h-4 text-accent-500" />{" "}
                                Arrival{" "}
                                {new Date(seg.ArrivalTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Luggage className="w-4 h-4 text-accent-500" />{" "}
                                {data.BaggageAllowance?.[0] || "—"}
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-accent-500" />{" "}
                                {data.FareType || "Refundable"}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* PRICING SECTION */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-5 rounded-2xl bg-accent-50/40 dark:bg-accent-950/30 border border-accent-100 dark:border-accent-900">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-accent-500" />
                        <p className="font-medium">Base Fare</p>
                    </div>
                    <p className="text-lg font-semibold">
                        {data.BasePrice} {data.SITECurrencyType}
                    </p>
                </div>
                <div className="p-5 rounded-2xl bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-yellow-500" />
                        <p className="font-medium">Taxes & Fees</p>
                    </div>
                    <p className="text-lg font-semibold">
                        {data.Taxes} {data.SITECurrencyType}
                    </p>
                </div>
                <div className="p-5 rounded-2xl bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900">
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        <p className="font-medium">Total Paid</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        {data.TotalPrice} {data.SITECurrencyType}
                    </p>
                </div>
            </div>

            {/* PASSENGER DETAILS */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-accent-500" /> Passenger
                    Details
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        <b>Name:</b> {traveler.GUEST_FIRSTNAME}{" "}
                        {traveler.GUEST_LASTNAME}
                    </p>
                    <p>
                        <b>Email:</b> {traveler.GUEST_EMAIL}
                    </p>
                    <p>
                        <b>Phone:</b> {traveler.GUEST_PHONE}
                    </p>
                    {/* <p>
                        <b>City:</b> {traveler.BILLING_CITY}
                    </p>
                    <p>
                        <b>Gender:</b> {traveler.GUEST_GENDER || "—"}
                    </p>
                    <p>
                        <b>DOB:</b> {traveler.GUEST_DOB || "—"}
                    </p> */}
                </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-accent-500" /> Payment
                    Information
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                        <b>Method:</b> {traveler.payment_method}
                    </p>
                    <p>
                        <b>Provider:</b> {traveler.payment_provider}
                    </p>
                    <p>
                        <b>Status:</b>{" "}
                        <span className="text-green-600 font-semibold">
                            {traveler.payment_res}
                        </span>
                    </p>
                    {/* <p>
                        <b>Transaction ID:</b>{" "}
                        {traveler.transaction_id || "N/A"}
                    </p> */}
                    <p>
                        <b>Issued Date:</b> {traveler.issued_date}
                    </p>
                </div>
            </div>

            {/* BOOKING STATUS */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-center gap-3">
                    {traveler.ticket_status === "FAILURE" ? (
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    ) : (
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    )}
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {traveler.ticket_status === "FAILURE"
                                ? "Ticket Issuance Failed"
                                : "Ticket Successfully Issued"}
                        </p>
                        <p className="text-sm text-gray-500">
                            {traveler.ticket_msg}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
