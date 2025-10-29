"use client";
import useBookingStore from "@/app/_store/bookingStore";
import { useRouter } from "next/navigation";

export default function ActionsBar({ module, orderId, state, supportHref }) {
    const router = useRouter();
    const bookingURL = useBookingStore((s) => s.bookingURL);

    const handleRetry = () => {
        if (bookingURL) router.push(bookingURL);
        else router.push("/");
    };

    const handleNewSearch = () => router.push("/");

    return (
        <div className="flex flex-wrap gap-3 justify-center mt-6">
            {["success", "pending"].includes(state) && (
                <>
                    <a
                        href={`/api/flight/getBooking?order_id=${orderId}`}
                        className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
                    >
                        Download Ticket
                    </a>
                    <a
                        href={`/api/invoice?order_id=${orderId}`}
                        className="px-5 py-2.5 rounded-lg bg-white border text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        Download Invoice
                    </a>
                </>
            )}

            {state === "failed" && (
                <>
                    <button
                        onClick={handleRetry}
                        className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90"
                    >
                        Retry
                    </button>
                    <button
                        onClick={handleNewSearch}
                        className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Start New Search
                    </button>
                </>
            )}

            <a
                href={supportHref}
                className="px-4 py-2.5 text-sm text-blue-600 hover:underline"
            >
                Contact Support
            </a>
        </div>
    );
}
