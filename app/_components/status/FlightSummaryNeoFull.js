"use client";

import useBookingStore from "@/app/_store/bookingStore";
import { motion } from "framer-motion";
import {
    PlaneTakeoff,
    PlaneLanding,
    Clock4,
    Wallet,
    User,
    ShieldCheck,
    CreditCard,
    AlertTriangle,
    Luggage,
    Calendar,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function FlightSummaryNeoFull({ data }) {
    const traveler = data?.BookingData || {};
    const segments = data?.BookingData.response.segments || [];
    const searchParams = useSearchParams();
    const booking_ref = searchParams.get("booking_ref");
    const PNR = searchParams.get("PNR");
    const { travelers } = useBookingStore();


    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#05203c]/60 via-[#0a1b2c]/60 to-[#000]/50 border border-white/10 backdrop-blur-2xl p-8 shadow-[0_0_60px_-10px_rgba(0,0,0,0.6)] text-white"
        >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-3">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <PlaneTakeoff className="w-6 h-6 text-accent" />
                    Flight Booking Summary
                </h2>
                <div className="text-sm text-gray-400">
                    Booking Ref: <b>{booking_ref}</b> | PNR:{" "}
                    <b>{PNR || "N/A"}</b>
                </div>
            </div>

            {/* ROUTE TIMELINE */}
            <div className="relative border-l-2 border-accent/40 ml-4 mb-10">
                {segments.map((seg, i) => (
                    <motion.div
                        key={i}
                        className="pl-6 pb-8 relative"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent"></span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {seg.OriginCity} → {seg.DestinationCity}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {seg.Carrier} {seg.FlightNumber} ·{" "}
                                    {seg.AircraftInfo}
                                </p>
                            </div>
                            <div className="text-right mt-2 sm:mt-0 text-gray-300">
                                <p className="text-sm">Duration</p>
                                <p className="font-medium">{seg.Duration}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <PlaneTakeoff className="w-4 h-4 text-accent" />{" "}
                                {seg.OriginAirport}
                            </div>
                            <div className="flex items-center gap-2">
                                <PlaneLanding className="w-4 h-4 text-accent" />{" "}
                                {seg.DestinationAirport}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" />{" "}
                                {new Date(seg.DepartureTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock4 className="w-4 h-4 text-accent" />{" "}
                                Arrival:{" "}
                                {new Date(seg.ArrivalTime).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Luggage className="w-4 h-4 text-accent" />{" "}
                                {data.BookingData.response
                                    .BaggageAllowance?.[0] || "—"}
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-accent" />{" "}
                                {data.FareType || "Refundable"}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* PRICING */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-1 text-gray-200">
                        <Wallet className="w-4 h-4 text-accent" />
                        Base Fare
                    </div>
                    <p className="text-lg font-semibold">
                        {data.BasePrice} {data.SITECurrencyType}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-400/20">
                    <div className="flex items-center gap-2 mb-1 text-yellow-300">
                        <Wallet className="w-4 h-4" />
                        Taxes & Fees
                    </div>
                    <p className="text-lg font-semibold">
                        {data.Taxes} {data.SITECurrencyType}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-green-500/10 border border-green-400/20">
                    <div className="flex items-center gap-2 mb-1 text-green-300">
                        <CreditCard className="w-4 h-4" />
                        Total Paid
                    </div>
                    <p className="text-2xl font-bold text-green-400">
                        {data.TotalPrice} {data.SITECurrencyType}
                    </p>
                </div>
            </div>

            {/* PASSENGER DETAILS */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-accent" /> Contact Details
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
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
                </div>
            </div>
            {/* PASSENGERS */}
            {/* PASSENGERS */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-accent" /> Passengers Details
                </h3>

                <div className="space-y-3">
                    {(travelers || []).map((trav, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.05 }}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 
                   flex items-center justify-between text-sm text-gray-300"
                        >
                            {/* Traveler Number */}
                            <span
                                className="px-2 py-1 rounded-lg bg-accent/20 
                         text-accent font-semibold text-xs uppercase"
                            >
                                #{trav.travelerNumber || i + 1} {trav.title}
                            </span>

                            {/* Traveler Full Name */}
                            <span className="font-medium text-gray-100">
                                {trav.firstName} {trav.lastName}
                            </span>

                            {/* Traveler Type */}
                            <span className="font-medium text-accent capitalize">
                                {trav.travelerType}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-accent" /> Payment Info
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <p>
                        <b>Method:</b> {traveler.payment_method}
                    </p>
                    <p>
                        <b>Provider:</b> {traveler.payment_provider || "—"}
                    </p>
                    <p>
                        <b>Status:</b>{" "}
                        <span className="text-green-400 font-semibold">
                            {traveler.payment_res}
                        </span>
                    </p>
                    <p>
                        <b>Issued Date:</b> {traveler.issued_date || "—"}
                    </p>
                </div>
            </div>

            {/* BOOKING STATUS */}
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
                <div className="flex items-center gap-3">
                    {traveler.ticket_status === "FAILURE" ? (
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    ) : (
                        <ShieldCheck className="w-6 h-6 text-green-400" />
                    )}
                    <div>
                        <p className="font-semibold">
                            {traveler.ticket_status === "FAILURE"
                                ? "Ticket Issuance Failed"
                                : "Ticket Successfully Issued"}
                        </p>
                        <p className="text-sm text-gray-400">
                            {traveler.ticket_msg}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
