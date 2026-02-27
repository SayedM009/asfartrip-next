"use client";

import { motion } from "framer-motion";
import {
    Hotel,
    CalendarDays,
    BedDouble,
    Users,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Receipt,
    Star,
    Baby,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import Image from "next/image";

export default function HotelBookingDetails({ booking }) {
    const t = useTranslations("HotelStatus");
    const { formatPrice } = useCurrency();

    const { hotel, room, stay, guests, contact, pricing, payment, status } = booking;

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
        >
            {/* Hotel & Room Details */}
            <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-lg shadow-accent-500/30">
                        <Hotel className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {t("hotel_details")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("hotel_booking_summary")}
                        </p>
                    </div>
                </div>

                {/* Hotel Info Card */}
                <div className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    {hotel.image && (
                        <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                width={192}
                                height={144}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {hotel.name}
                            </h3>
                            {hotel.starRating > 0 && (
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: parseInt(hotel.starRating) }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            )}
                        </div>
                        {hotel.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span>{hotel.address}</span>
                            </div>
                        )}
                        {(hotel.city || hotel.country) && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {[hotel.city, hotel.country].filter(Boolean).join(", ")}
                            </p>
                        )}

                        {/* Room Details */}
                        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
                            <div className="flex items-center gap-2">
                                <BedDouble className="w-4 h-4 text-accent-500" />
                                <span className="font-medium">{room.name}</span>
                            </div>
                            {room.boardName && room.boardName !== room.name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 ltr:ml-6 rtl:mr-6">
                                    {room.boardName}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stay Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-sm font-medium">{t("check_in")}</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                            {stay.checkIn || "-"}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-1">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-sm font-medium">{t("check_out")}</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                            {stay.checkOut || "-"}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800">
                        <div className="flex items-center gap-2 text-accent-700 dark:text-accent-400 mb-1">
                            <BedDouble className="w-4 h-4" />
                            <span className="text-sm font-medium">{t("stay_info")}</span>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                            {stay.nights} {t("nights")} · {stay.roomCount} {t("rooms")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Guests & Contact + Payment */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guests */}
                <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t("guest_details")}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {guests.map((guest, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                            >
                                {guest.type === "child" ? (
                                    <Baby className="w-5 h-5 text-purple-500" />
                                ) : (
                                    <User className="w-5 h-5 text-blue-500" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                        {guest.salutation} {guest.firstName} {guest.lastName}
                                    </p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="capitalize text-xs flex-shrink-0"
                                >
                                    {guest.type === "lead"
                                        ? t("lead_guest")
                                        : guest.type === "child"
                                            ? t("child")
                                            : t("adult")}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                            {t("contact_info")}
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-200">{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-200">{contact.phone}</span>
                            </div>
                            {contact.address && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700 dark:text-gray-200">{contact.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment */}
                <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t("payment_details")}
                        </h3>
                    </div>

                    {/* Total Amount */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 mb-5">
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">
                            {t("total_amount")}
                        </p>
                        <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatPrice(pricing.amount)}
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-3 text-sm">
                        {pricing.vat > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t("vat")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatPrice(pricing.vat)}
                                </span>
                            </div>
                        )}
                        {pricing.gatewayCharges > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t("gateway_charges")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatPrice(pricing.gatewayCharges)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Payment Method Info */}
                    <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        {payment.gateway && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("payment_gateway")}</span>
                                <span className="font-medium text-gray-900 dark:text-white capitalize">
                                    {payment.gateway}
                                </span>
                            </div>
                        )}
                        {payment.transaction_id && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("transaction_id")}</span>
                                <span className="font-mono text-xs text-gray-900 dark:text-white">
                                    {payment.transaction_id}
                                </span>
                            </div>
                        )}
                        {payment.status && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("payment_status")}</span>
                                <Badge
                                    variant={
                                        payment.status === "completed" || payment.status === "success"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="capitalize"
                                >
                                    {payment.status}
                                </Badge>
                            </div>
                        )}
                        {payment.card_type && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("card_type")}</span>
                                <span className="font-medium text-gray-900 dark:text-white capitalize">
                                    {payment.card_type}
                                    {payment.card_last4 && ` ···· ${payment.card_last4}`}
                                </span>
                            </div>
                        )}
                        {payment.transaction_date && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("transaction_date")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {payment.transaction_date}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Booking Status */}
                    {status && (
                        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t("booking_status")}
                            </h4>
                            {status.booking && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">{t("booking")}</span>
                                    <Badge
                                        variant={status.booking === "CONFIRMED" ? "default" : "secondary"}
                                        className="capitalize"
                                    >
                                        {status.booking}
                                    </Badge>
                                </div>
                            )}
                            {status.ticket && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">{t("voucher_status")}</span>
                                    <Badge variant="secondary" className="capitalize">
                                        {status.ticket}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}
