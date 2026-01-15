"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
    CheckCircle2,
    Clock,
    XCircle,
    Shield,
    FileText,
    Download,
    Home,
    Mail,
    User,
    Phone,
    Calendar,
    CreditCard,
    MapPin,
    Loader2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
    getInsuranceBookingDetails,
    parseInsuranceBookingData,
} from "../../service/getInsuranceBookingDetails";
import { sendVoucher } from "@/app/_modules/payment/checkstatus/services/sechVoucher";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useTheme } from "next-themes";

export default function InsuranceStatusPage({
    status,
    orderId,
    bookingRef,
    policyId,
    paymentInfo,
}) {
    const t = useTranslations("InsuranceStatus");
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const [showAllTravelers, setShowAllTravelers] = useState(false);
    const { formatPrice } = useCurrency();
    const { theme } = useTheme();
    const condition = theme == "dark";

    // Constants
    const MAX_VISIBLE_TRAVELERS = 5;

    // Handle sending voucher via email
    const handleSendVoucher = async () => {
        const bookingReference = orderId || bookingRef;
        if (!bookingReference) {
            setEmailError(t("missingBookingRef"));
            return;
        }

        setSendingEmail(true);
        setEmailError(null);
        setEmailSent(false);

        try {
            await sendVoucher(bookingReference, "INSURANCE");
            setEmailSent(true);
            // Reset success message after 5 seconds
            setTimeout(() => setEmailSent(false), 5000);
        } catch (err) {
            console.error("Failed to send voucher:", err);
            setEmailError(err.message || t("sendFailed"));
        } finally {
            setSendingEmail(false);
        }
    };

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await getInsuranceBookingDetails(
                    orderId || bookingRef
                );
                if (response.status === "success" && response.data) {
                    const parsed = parseInsuranceBookingData(response.data);
                    setBookingData(parsed);
                } else {
                    setError("Failed to load booking details");
                }
            } catch (err) {
                console.error("Failed to fetch insurance booking:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId || bookingRef) {
            fetchBookingDetails();
        } else {
            setLoading(false);
        }
    }, [orderId, bookingRef]);

    const statusConfig = {
        success: {
            icon: CheckCircle2,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/30",
            title: t("policyConfirmed"),
            subtitle: t("policyIssuedSuccess"),
        },
        pending: {
            icon: Clock,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/30",
            title: t("processingPolicy"),
            subtitle: t("policyPending"),
        },
        failed: {
            icon: XCircle,
            color: "text-rose-500",
            bgColor: "bg-rose-500/10",
            borderColor: "border-rose-500/30",
            title: t("bookingFailed"),
            subtitle: t("transactionFailed"),
        },
    };

    const currentStatus = statusConfig[status] || statusConfig.failed;
    const StatusIcon = currentStatus.icon;

    // Dynamic gradient colors based on status
    const headerGradients = {
        success: "from-emerald-500 to-teal-600",
        pending: "from-amber-500 to-orange-600",
        failed: "from-rose-500 to-red-600",
    };
    const headerGradient = headerGradients[status] || headerGradients.failed;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {t("loadingDetails")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b my-6 md:my-12">
            <div className="">
                {bookingData && (
                    <>
                        {/* Policy Details Card with Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6"
                        >
                            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Header - Color changes based on status */}
                                <div
                                    className={`bg-gradient-to-r ${headerGradient} px-6 py-5`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 border-2 border-white/30">
                                                <StatusIcon className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-xl md:text-2xl font-bold text-white">
                                                    {currentStatus.title}
                                                </h1>
                                                <p className="text-white/80 text-sm">
                                                    {currentStatus.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-white/70 text-xs">
                                                {t("policyNumber")}
                                            </p>
                                            <p className="font-mono font-bold text-white text-lg">
                                                {
                                                    bookingData.policy
                                                        .policyNumber
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    {/* Policy Name & Order ID */}
                                    <div className="mt-4 pt-4 border-t  border-white/20 flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 border-2 border-white/30">
                                                <Shield className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">
                                                    {bookingData.policy.title}
                                                </p>
                                                <p className="text-white/70 text-sm">
                                                    {
                                                        bookingData.policy
                                                            .subtitle
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        {/* Desktop: Order ID only */}
                                        {(orderId || bookingRef) && (
                                            <div className="text-right hidden sm:block">
                                                <p className="text-white/70 text-xs">
                                                    {t("orderId")}
                                                </p>
                                                <p className="font-mono font-semibold text-white">
                                                    {orderId || bookingRef}
                                                </p>
                                            </div>
                                        )}
                                        {/* Mobile: Order ID & Policy Number side by side */}
                                        <div className="flex gap-6 sm:hidden justify-between w-full border-t border-white/20 pt-4">
                                            {(orderId || bookingRef) && (
                                                <div className="text-center">
                                                    <p className="text-white/70 text-xs">
                                                        {t("orderId")}
                                                    </p>
                                                    <p className="font-mono font-semibold text-white text-sm">
                                                        {orderId || bookingRef}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <p className="text-white/70 text-xs">
                                                    {t("policyNumber")}
                                                </p>
                                                <p className="font-mono font-bold text-white text-sm">
                                                    {
                                                        bookingData.policy
                                                            .policyNumber
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Policy Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50/50 dark:bg-gray-800/30">
                                    <div className="text-center">
                                        <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t("effectiveDate")}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {bookingData.policy.effectiveDate}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t("expiryDate")}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {bookingData.policy.expiryDate}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t("duration")}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {bookingData.policy.durationText}{" "}
                                            {t(bookingData.policy.durationUnit)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Shield className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t("tripType")}
                                        </p>
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {t(
                                                `tripType_${bookingData.policy.tripType}`
                                            )}
                                        </p>
                                    </div>
                                    {/* <div className="text-center">
                                        <FileText className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {t("status")}
                                        </p>
                                        <p
                                            className={`text-sm font-semibold ${currentStatus.color}`}
                                        >
                                            {status === "success"
                                                ? t("active")
                                                : status === "pending"
                                                ? t("pending")
                                                : t("failed")}
                                        </p>
                                    </div> */}
                                </div>
                            </div>
                        </motion.div>

                        {/* Details Grid */}
                        <div className=" grid md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <User className="w-4 h-4" />
                                        {t("travelerDetails")}
                                        {bookingData.travelerDetails.length >
                                            1 && (
                                            <span className="text-xs font-normal text-gray-400">
                                                (
                                                {
                                                    bookingData.travelerDetails
                                                        .length
                                                }{" "}
                                                {t("travelers")})
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <div className="">
                                    {(showAllTravelers
                                        ? bookingData.travelerDetails
                                        : bookingData.travelerDetails.slice(
                                              0,
                                              MAX_VISIBLE_TRAVELERS
                                          )
                                    ).map((traveler, idx) => (
                                        <div
                                            key={idx}
                                            className={`space-y-2 text-sm ${
                                                idx > 0
                                                    ? "pt-3 border-t border-gray-200 dark:border-gray-700"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    {t("name")}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {traveler.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    {t("passport")}
                                                </span>
                                                <span className="font-mono text-gray-900 dark:text-white">
                                                    {traveler.passport}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    {t("nationality")}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {traveler.nationality}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    {t("dateOfBirth")}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {traveler.dob}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {bookingData.travelerDetails.length >
                                    MAX_VISIBLE_TRAVELERS && (
                                    <button
                                        onClick={() =>
                                            setShowAllTravelers(
                                                !showAllTravelers
                                            )
                                        }
                                        className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                                    >
                                        {showAllTravelers
                                            ? t("showLess")
                                            : t("showAllTravelers", {
                                                  count: bookingData
                                                      .travelerDetails.length,
                                              })}
                                    </button>
                                )}
                            </motion.div>

                            {/* Payment Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.35 }}
                                className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5"
                            >
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    <CreditCard className="w-4 h-4" />
                                    {t("paymentDetails")}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {bookingData.paymentDetails.map(
                                        (item, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex justify-between ${
                                                    item.isTotal
                                                        ? "pt-2 border-t border-gray-200 dark:border-gray-600 font-bold"
                                                        : ""
                                                }`}
                                            >
                                                <span className="text-gray-500">
                                                    {item.label}
                                                </span>
                                                <span
                                                    className={
                                                        item.isTotal
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-gray-900 dark:text-white"
                                                    }
                                                >
                                                    {formatPrice(
                                                        item.value,
                                                        condition
                                                            ? "white"
                                                            : "black"
                                                    )}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                                {paymentInfo?.gateway && (
                                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500">
                                        <div className="flex justify-between">
                                            <span>{t("gateway")}</span>
                                            <span>{paymentInfo.gateway}</span>
                                        </div>
                                        {paymentInfo.transaction_id && (
                                            <div className="flex justify-between mt-1">
                                                <span>
                                                    {t("transactionId")}
                                                </span>
                                                <span className="font-mono">
                                                    {paymentInfo.transaction_id}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            {/* Coverage Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5"
                            >
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    <Shield className="w-4 h-4" />
                                    {t("coverageDetails")}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {bookingData.coverageDetails.map(
                                        (item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between"
                                            >
                                                <span className="text-gray-500">
                                                    {item.name}
                                                </span>
                                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                    {item.value}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.45 }}
                                className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5"
                            >
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    <Mail className="w-4 h-4" />
                                    {t("contactInfo")}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            {t("name")}
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {bookingData.contactInfo.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            {t("phone")}
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {bookingData.contactInfo.phone}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            {t("email")}
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {bookingData.contactInfo.email}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className=" mt-8"
                >
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {status === "success" && (
                            <>
                                {/* <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:brightness-110 transition-all">
                                    <Download className="w-5 h-5" />
                                    {t("downloadPolicy")}
                                </button> */}
                                <button
                                    onClick={handleSendVoucher}
                                    disabled={sendingEmail || emailSent}
                                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                                        emailSent
                                            ? "bg-emerald-600 text-white"
                                            : emailError
                                            ? "bg-rose-500 text-white"
                                            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-110"
                                    } ${
                                        sendingEmail
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {sendingEmail ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t("sending")}
                                        </>
                                    ) : emailSent ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            {t("emailSent")}
                                        </>
                                    ) : emailError ? (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            {t("sendFailed")}
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            {t("sendViaEmail")}
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                        <Link
                            href="/insurance"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            <Shield className="w-5 h-5" />
                            {t("buyNewPolicy")}
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            <Home className="w-5 h-5" />
                            {t("goHome")}
                        </Link>
                    </div>
                </motion.div>

                {/* Bottom Spacing for Mobile */}
                <div className="h-12 md:hidden" />
            </div>
        </div>
    );
}
