"use client";

import { useEffect, useState } from "react";
import { useBookingSession } from "@/app/_hooks/useBookingSession";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function BookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { storeSession, getValidSession } = useBookingSession();

    const [isValidating, setIsValidating] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        validateSession();
    }, []);

    const validateSession = async () => {
        try {
            // Get session_id and temp_id from URL
            const sessionId = searchParams.get("session_id");
            const tempId = searchParams.get("temp_id");

            console.log("🔍 Validating booking session:", {
                sessionId,
                tempId,
            });

            // Check if parameters exist
            if (!sessionId || !tempId) {
                // Try to get from stored session
                const storedSession = getValidSession();

                if (storedSession) {
                    console.log("✅ Using stored session data");
                    setBookingData(storedSession);
                    setIsValidating(false);
                    return;
                }

                throw new Error(
                    "Missing session parameters. Please start a new search."
                );
            }

            // Store session data
            const sessionData = {
                sessionId,
                tempId,
                // You can fetch additional data here if needed
            };

            storeSession(sessionData);
            setBookingData(sessionData);
            setIsValidating(false);

            console.log("✅ Session validated successfully");
        } catch (err) {
            console.error("❌ Session validation failed:", err);
            setError(err.message);
            setIsValidating(false);

            // Redirect to home after 3 seconds
            setTimeout(() => {
                router.push("/");
            }, 3000);
        }
    };

    // Loading state
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                        Validating your booking session...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Session Error
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">
                        Redirecting to home page...
                    </p>
                </div>
            </div>
        );
    }

    // Main booking form
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Complete Your Booking
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Session ID: {bookingData?.sessionId}
                    </p>

                    {/* Session Info Display */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-8">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Booking Session Active
                        </h3>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>Session ID: {bookingData?.sessionId}</p>
                            <p>Temp ID: {bookingData?.tempId}</p>
                            {bookingData?.totalPrice && (
                                <p>
                                    Total Price: {bookingData.currency}{" "}
                                    {bookingData.totalPrice}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Booking Form Sections */}
                    <div className="space-y-8">
                        {/* 1. Passenger Information */}
                        <section className="border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                1. Passenger Information
                            </h2>
                            <p className="text-gray-600">
                                Passenger details form will go here...
                            </p>
                            {/* Add your passenger form here */}
                        </section>

                        {/* 2. Contact Information */}
                        <section className="border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                2. Contact Information
                            </h2>
                            <p className="text-gray-600">
                                Contact details form will go here...
                            </p>
                            {/* Add your contact form here */}
                        </section>

                        {/* 3. Additional Services */}
                        <section className="border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                3. Additional Services (Optional)
                            </h2>

                            {/* Extra Baggage */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Extra Baggage
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Add extra checked baggage to your flight
                                </p>
                                {/* Baggage options will go here */}
                            </div>

                            {/* Travel Insurance */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Travel Insurance
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Protect your trip with travel insurance
                                </p>
                                {/* Insurance options will go here */}
                            </div>
                        </section>

                        {/* 4. Payment */}
                        <section className="border rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                4. Payment
                            </h2>
                            <p className="text-gray-600">
                                Payment form will go here...
                            </p>
                            {/* Add your payment form here */}
                        </section>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Go Back
                        </button>
                        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Continue to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
