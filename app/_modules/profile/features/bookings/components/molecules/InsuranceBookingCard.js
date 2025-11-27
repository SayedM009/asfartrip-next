import { motion } from "framer-motion";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

export default function InsuranceBookingCard({ booking }) {
    const p = useTranslations("Profile");
    const { formatPrice } = useCurrency();

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm"
        >
            {/* Header Row */}
            <div
                className={`flex items-center justify-between px-4 py-2 text-xs font-semibold ${booking.booking_status === "CREATED"
                        ? "bg-green-50 text-green-700"
                        : booking.booking_status === "CANCELLED" ||
                            booking.booking_status === null
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-700"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <span className="uppercase">
                        {p(
                            booking.booking_status === null
                                ? "FAILURE"
                                : booking.booking_status
                        )}
                    </span>
                </div>

                <span>
                    {formatDisplayDate(booking.voucher_date, {
                        withYear: true,
                        pattern: "EEEE d MMMM yyyy ",
                    })}
                </span>
            </div>

            {/* Main Content */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                        {p("policy_number")} :{" "}
                        {booking.policy_id || booking.policy_number || "—"}
                    </p>
                    <span className="text-sm font-bold">
                        {formatPrice(booking.TotalPrice || booking.premium)}
                    </span>
                </div>

                {/* INSURANCE DETAILS */}
                <div className="mt-2">
                    <div className="text-md text-gray-700 dark:text-gray-100 flex items-center gap-2 font-semibold capitalize">
                        {booking.customer_name || "—"}{" "}
                        <ChevronBasedOnLanguage icon="arrow" />
                        {booking.request?.destination ||
                            booking.Destination ||
                            "—"}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                        Adults: {booking.request?.ADT || 0}, Children:{" "}
                        {booking.request?.CHD || 0}, Infants:{" "}
                        {booking.request?.INF || 0}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                        Scheme ID: {booking.scheme_id || "—"} | Quote ID:{" "}
                        {booking.quote_id || "—"}
                    </div>

                    {booking.insurance_quote && (
                        <div className="text-xs text-gray-400 mt-1">
                            Plan:{" "}
                            {JSON.parse(booking.insurance_quote)?.quotes?.[
                                booking.scheme_id
                            ]?.name || "Standard Cover"}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
