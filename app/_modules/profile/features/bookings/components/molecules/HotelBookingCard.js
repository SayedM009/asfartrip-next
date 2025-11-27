import { motion } from "framer-motion";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

export default function HotelBookingCard({ booking }) {
    const p = useTranslations("Profile");
    const { formatPrice } = useCurrency();

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm"
        >
            {/* Header Row */}
            <div
                className={`flex items-center justify-between px-4 py-2 text-xs font-semibold ${booking.ticket_status === "CONFIRMED" ||
                        booking.ticket_status === "CREATED"
                        ? "bg-green-50 text-green-700"
                        : booking.ticket_status === "CANCELLED" ||
                            booking.ticket_status === "FAILURE"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-700"
                    }`}
            >
                <div className="flex items-center gap-2 ">
                    <span className="uppercase">{p(booking.ticket_status)}</span>
                </div>

                <span>
                    {formatDisplayDate(
                        booking.voucher_date ||
                        booking.travel_date ||
                        booking.issued_date,
                        {
                            withYear: true,
                            pattern: "EEEE d MMMM yyyy ",
                        }
                    )}
                </span>
            </div>

            {/* Main Content */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                        {p("booking_id")} :{" "}
                        {booking.pnr_no || booking.booking_no || "—"}
                    </p>
                    <span className="text-sm font-bold">
                        {formatPrice(booking.amount)}
                    </span>
                </div>

                {/* HOTEL DETAILS */}
                <div className="mt-2">
                    <div className="text-md text-gray-700 dark:text-gray-50 flex items-center gap-2 font-semibold">
                        {booking.details?.hotel_name ||
                            "Hotel Name Not Provided"}{" "}
                        {booking.details?.traveler_country && (
                            <>
                                <ChevronBasedOnLanguage icon="arrow" />
                                {booking.details.traveler_country}
                            </>
                        )}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                        Check-in:{" "}
                        {formatDisplayDate(
                            booking.details?.request?.check_in ||
                            booking.travel_date,
                            {
                                withYear: true,
                                pattern: "EEEE d MMMM yyyy ",
                            }
                        )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Check-out:{" "}
                        {formatDisplayDate(
                            booking.details?.request?.check_out,
                            { withYear: true }
                        )}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                        Room: {booking.details?.room_name} –{" "}
                        {booking.details?.board_name}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
