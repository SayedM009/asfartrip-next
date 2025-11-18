"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { checkStatus } from "@/app/_libs/paymentService";
import {
    confirmFlightBooking,
    issueFlightBooking,
} from "@/app/_libs/flightService";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import useBookingStore from "@/app/_store/bookingStore";

/** =========================
 *  AI Orb (status-reactive)
 *  ========================= */
function AIOrb({ status }) {
    const palette = useMemo(() => {
        if (status === "success" || status === "partial-success")
            return "from-emerald-500 to-teal-400";
        if (status === "error") return "from-rose-600 to-red-400";
        return "from-orange-400 to-amber-200";
    }, [status]);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative mx-auto"
        >
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.16),transparent_60%)] blur-3xl" />
            <div
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${palette} shadow-lg border-2 border-gray-100 dark:border-gray-700`}
            />
            <motion.div
                className="absolute inset-0 rounded-full border border-white/30"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    );
}

/** =========================
 *  Step Status Component
 *  ========================= */
function StepStatus({ steps }) {
    const getStepStyle = (stepStatus) => {
        switch (stepStatus) {
            case "success":
                return "border-emerald-500 bg-emerald-100/70 text-emerald-700";
            case "error":
                return "border-rose-600 bg-rose-100/70 text-rose-700";
            case "loading":
                return "border-amber-400 bg-amber-100/70 text-amber-700 animate-pulse";
            default: // pending
                return "border-gray-200 dark:border-gray-600 bg-white/40 dark:bg-gray-900/40 text-gray-500 dark:text-gray-300";
        }
    };

    return (
        <div className="mt-3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-lg px-3 py-2 border transition-all duration-300 ${getStepStyle(
                            step.status
                        )}`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span>{step.label}</span>
                            {step.status === "loading" && (
                                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                            )}
                            {step.status === "success" && (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            )}
                            {step.status === "error" && (
                                <XCircle className="w-3 h-3 text-rose-500" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/** =========================
 *  Main Page
 *  ========================= */
export default function PaymentCallback({ params }) {
    const { booking_ref } = params;
    const router = useRouter();

    const [status, setStatus] = useState("loading");
    const [steps, setSteps] = useState([
        { label: "1. Payment Verified", status: "pending" },
        { label: "2. Booking Confirmed", status: "pending" },
        { label: "3. Ticket Issuance", status: "pending" },
    ]);

    const {
        gateway: { ifrurl },
        searchURL,
        sameBookingURL,
    } = useBookingStore();

    const [statusMessage, setStatusMessage] = useState(
        "Verifying your payment…"
    );
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 2;

    const updateStep = (stepIndex, newStatus) => {
        setSteps((prev) =>
            prev.map((step, idx) =>
                idx === stepIndex ? { ...step, status: newStatus } : step
            )
        );
    };

    const checkPaymentStatus = useCallback(async () => {
        if (!booking_ref) {
            setStatus("error");
            setStatusMessage("Missing booking reference.");
            updateStep(0, "error");
            return;
        }

        try {
            setStatus("loading");
            updateStep(0, "loading");
            setStatusMessage("Checking payment status…");

            const res = await checkStatus(booking_ref);

            const paymentSuccess =
                res?.status?.toLowerCase() === "success" &&
                res?.gateway_response?.status?.toLowerCase() === "completed";

            const paymentFailed =
                res?.order_status?.toLowerCase() === "failure" ||
                ["failed", "cancelled", "declined"].includes(
                    (res?.gateway_response?.status || "").toLowerCase()
                );

            if (paymentFailed) {
                setStatus("error");
                updateStep(0, "error");
                setStatusMessage("Payment failed or cancelled.");
                return;
            }

            if (paymentSuccess) {
                updateStep(0, "success");
                setStatusMessage("Payment successful. Confirming the booking…");

                updateStep(1, "loading");

                try {
                    const confirmRes = await confirmFlightBooking(
                        res.booking_ref
                    );
                    const bookingStatus =
                        confirmRes?.booking_status?.toUpperCase();

                    if (bookingStatus === "CONFIRMED") {
                        updateStep(1, "success");
                        setStatusMessage("Booking confirmed. Issuing ticket…");

                        updateStep(2, "loading");

                        try {
                            const issueRes = await issueFlightBooking(
                                confirmRes.booking_reference,
                                res.gateway_response.id,
                                "Payment Gateway"
                            );

                            updateStep(2, "success");
                            setStatus("success");
                            setStatusMessage(
                                issueRes?.alreadyIssued
                                    ? "Your ticket is already issued. Redirecting…"
                                    : "Booking confirmed. Redirecting…"
                            );

                            setTimeout(() => {
                                router.push(
                                    `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&module=flight&PNR=${confirmRes.PNR}`
                                );
                            }, 1500);
                            return;
                        } catch (issueErr) {
                            updateStep(2, "success");
                            setStatus("partial-success");
                            setStatusMessage(
                                "Payment received successfully. Your ticket will be issued within 3 hours."
                            );

                            setTimeout(() => {
                                router.push(
                                    `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&pending=true&module=flight&PNR=${confirmRes.PNR}`
                                );
                            }, 3000);
                            return;
                        }
                    }

                    if (["PENDING", "PROCESSING"].includes(bookingStatus)) {
                        updateStep(1, "success");
                        updateStep(2, "success");
                        setStatus("partial-success");
                        setStatusMessage(
                            "Payment received successfully. Your ticket will be issued within 3 hours."
                        );

                        setTimeout(() => {
                            router.push(
                                `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&pending=true&module=flight`
                            );
                        }, 3000);
                        return;
                    }

                    updateStep(1, "success");
                    updateStep(2, "success");
                    setStatus("partial-success");
                    setStatusMessage(
                        "Payment received successfully. Your ticket will be issued within 3 hours."
                    );

                    setTimeout(() => {
                        router.push(
                            `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&pending=true&module=flight`
                        );
                    }, 3000);
                    return;
                } catch (confirmErr) {
                    updateStep(1, "success");
                    updateStep(2, "success");
                    setStatus("partial-success");
                    setStatusMessage(
                        "Payment received successfully. Your ticket will be issued within 3 hours."
                    );

                    setTimeout(() => {
                        router.push(
                            `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&pending=true&module=flight`
                        );
                    }, 3000);
                    return;
                }
            }

            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `Rechecking payment status... (Retry ${retryCount + 1})`
                );
                setTimeout(
                    () => setRetryCount((n) => n + 1),
                    1600 + retryCount * 600
                );
                return;
            }

            setStatus("error");
            updateStep(0, "error");
            setStatusMessage("Unable to determine payment status.");
        } catch (err) {
            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `Network issue. Retrying (${
                        retryCount + 1
                    }/${MAX_RETRIES})…`
                );
                setTimeout(() => setRetryCount((n) => n + 1), 1800);
                return;
            }
            setStatus("error");
            updateStep(0, "error");
            setStatusMessage("Network error. Please try again.");
        }
    }, [booking_ref, retryCount, router]);

    useEffect(() => {
        checkPaymentStatus();
    }, [checkPaymentStatus]);

    return (
        <div className="relative overflow-hidden  min-h-screen">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2">
                <motion.div
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-xl rounded-3xl bg-white/20 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-600 px-6 py-8 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_50px_rgba(10,10,10,0.70)]"
                >
                    <div className="flex flex-col sm:items-center gap-6">
                        <AIOrb status={status} />

                        <AnimatePresence mode="wait">
                            {status === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2">
                                        <Loader2 className="size-5 animate-spin text-amber-500" />
                                        <span className="tracking-wide text-sm text-gray-700 dark:text-gray-200">
                                            {statusMessage}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                                        Our AI agent is coordinating with the
                                        payment gateway and airline systems.
                                    </p>
                                </motion.div>
                            )}

                            {(status === "success" ||
                                status === "partial-success") && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2 text-emerald-700">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        <span className="tracking-wide font-medium">
                                            {statusMessage}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                                        {status === "partial-success"
                                            ? "Your payment has been deducted successfully. We are processing your ticket and it will be sent to your email within maximum 3 hours."
                                            : "Finalizing your itinerary and preparing e-ticket details…"}
                                    </p>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2 text-rose-700">
                                        <XCircle className="w-6 h-6 text-rose-600" />
                                        <span className="tracking-wide font-medium">
                                            {statusMessage}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mt-5">
                                        <button
                                            onClick={() =>
                                                (window.location.href = ifrurl)
                                            }
                                            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                        >
                                            Retry Payment
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() =>
                                                    router.push(sameBookingURL)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                            >
                                                Same Booking
                                            </button>

                                            <button
                                                onClick={() =>
                                                    router.push(searchURL)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-600 text-white font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                            >
                                                New Search
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <StepStatus steps={steps} />
                    </div>
                </motion.div>

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    Powered by AI · Real-time orchestration · Secure gateway
                </div>
            </div>
        </div>
    );
}
