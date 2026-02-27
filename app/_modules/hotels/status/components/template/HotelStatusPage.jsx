"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import StatusHero from "./HotelStatusHero";
import HotelBookingDetails from "../organisms/HotelBookingDetails";

export default function HotelStatusPage({
    bookingData,
    status,
    bookingRef,
    pnrNo,
    bookingNo,
    paymentInfo,
}) {
    const t = useTranslations("HotelStatus");

    // Transform booking data for display
    const booking = bookingData
        ? {
            hotel: {
                name: bookingData.hotel_details?.name || "",
                image: bookingData.hotel_details?.thumb_image || "",
                starRating: bookingData.hotel_details?.star_rating || 0,
                address: bookingData.hotel_details?.address || "",
                city: bookingData.hotel_details?.city_name || "",
                country: bookingData.hotel_details?.country || "",
            },
            room: {
                name: bookingData.room_name || "",
                boardName: bookingData.board_name || "",
            },
            stay: {
                checkIn: bookingData.request?.check_in || "",
                checkOut: bookingData.request?.check_out || "",
                nights: bookingData.request?.nights || 0,
                roomCount: bookingData.request?.room_count || 1,
            },
            guests: parseGuests(bookingData),
            contact: {
                name: `${bookingData.traveler_fname || ""} ${bookingData.traveler_lname || ""}`.trim(),
                email: bookingData.traveler_email || "",
                phone: bookingData.traveler_phone || "",
                address: bookingData.traveler_address || "",
                country: bookingData.traveler_country || "",
            },
            pricing: {
                amount: parseFloat(bookingData.amount || 0),
                currency: bookingData.currency_code || paymentInfo?.currency || "AED",
                vat: parseFloat(bookingData.VAT || 0),
                gatewayCharges: parseFloat(bookingData.gateway_charges || 0),
                adminMarkup: parseFloat(bookingData.admin_markup || 0),
            },
            payment: {
                gateway: paymentInfo?.gateway || "",
                transaction_id: paymentInfo?.transaction_id || bookingData.transaction_id || "",
                status: paymentInfo?.status || bookingData.payment_status || "",
                card_type: paymentInfo?.card_type || "",
                card_last4: paymentInfo?.card_last4 || "",
                transaction_date: paymentInfo?.transaction_date || bookingData.created_date || "",
                amount: parseFloat(paymentInfo?.amount || bookingData.amount || 0),
                currency: paymentInfo?.currency || bookingData.currency_code || "AED",
            },
            status: {
                booking: bookingData.booking_status || "",
                ticket: bookingData.ticket_status || "",
                payment: bookingData.payment_status || "",
            },
        }
        : null;

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b my-6 md:my-12">
            <div className="relative z-10 container mx-auto">
                {/* Status Hero */}
                <StatusHero
                    status={status}
                    bookingRef={bookingRef}
                    pnrNo={pnrNo || bookingData?.pnr_no || ""}
                    bookingNo={bookingNo || bookingData?.booking_no || ""}
                />

                {/* Divider */}
                <motion.div
                    className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent w-3/4 mx-auto my-2 opacity-30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                />

                {/* Booking Details */}
                {booking ? (
                    <HotelBookingDetails booking={booking} />
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        {t("no_booking_data")}
                    </div>
                )}

                <div className="h-12 md:hidden" />
            </div>
        </div>
    );
}

/**
 * Parse the guests_json string into readable guest list
 */
function parseGuests(bookingData) {
    const guests = [];

    // Lead guest
    guests.push({
        type: "lead",
        salutation: bookingData.salutation || "",
        firstName: bookingData.traveler_fname || "",
        lastName: bookingData.traveler_lname || "",
    });

    // Other guests from guests_json
    try {
        if (bookingData.guests_json) {
            const parsed =
                typeof bookingData.guests_json === "string"
                    ? JSON.parse(bookingData.guests_json)
                    : bookingData.guests_json;

            // Structure: { "1": { adults: { "2": {...} }, childs: { "1": {...} } } }
            Object.values(parsed).forEach((room) => {
                if (room.adults) {
                    Object.values(room.adults).forEach((adult) => {
                        guests.push({
                            type: "adult",
                            salutation: adult.salutation || "",
                            firstName: adult.fname || "",
                            lastName: adult.lname || "",
                        });
                    });
                }
                if (room.childs) {
                    Object.values(room.childs).forEach((child) => {
                        guests.push({
                            type: "child",
                            salutation: child.salutation || "",
                            firstName: child.fname || "",
                            lastName: child.lname || "",
                        });
                    });
                }
            });
        }
    } catch (err) {
        console.error("Failed to parse guests_json:", err);
    }

    return guests;
}
