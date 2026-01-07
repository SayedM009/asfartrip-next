import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function useHandleBookNow() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    async function handleBookNow(quote) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Reconstruct searchParams exactly as they were in the search
            const parsedDates = JSON.parse(searchParams.get("dates") || "{}");
            const parsedPassengers = JSON.parse(
                searchParams.get("passengers") || "{}"
            );
            const tripType =
                searchParams.get("tripType") || searchParams.get("trip_type");

            // Build search data matching the old format
            const searchData = {
                region: searchParams.get("region"),
                depart_date: parsedDates.from,
                journey_type: tripType,
                adults: String(parsedPassengers.adults || 0),
                children: String(parsedPassengers.children || 0),
                seniors: String(parsedPassengers.seniors || 0),
            };

            // Add return_date if applicable
            if (tripType === "return" && parsedDates.to) {
                searchData.return_date = parsedDates.to;
            }

            console.log("Search data:", searchData);
            console.log("Quote:", quote);

            // Prepare cart data - EXACTLY like the old code
            const cartData = {
                quote_id: quote.quote_id,
                scheme_id: quote.scheme.scheme_id,
                plan: quote, // Send the ENTIRE quote object
                searchParams: searchData,
            };

            console.log("Sending to cart:", cartData);

            const response = await fetch("/api/insurance/add-to-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartData),
            });

            const responseText = await response.text();
            console.log("Raw response:", responseText);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    throw new Error(
                        `Server error: ${response.status
                        }. Response: ${responseText.substring(0, 200)}`
                    );
                }
                throw new Error(errorData.error || "Failed to add to cart");
            }

            const data = JSON.parse(responseText);
            console.log("Cart response:", data);

            // Save to localStorage (matching old behavior)
            if (typeof window !== "undefined") {
                localStorage.setItem(
                    "insuranceCartItem",
                    JSON.stringify(quote)
                );
            }

            setSuccess(true);

            // Navigate to booking page with session_id
            if (data.session_id) {
                setTimeout(() => {
                    router.push(`/insurance/booking?session_id=${data.session_id}`);
                }, 1000);
            } else {
                throw new Error("No session_id returned from server");
            }
        } catch (err) {
            console.error("Book now error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        success,
        handleBookNow,
    };
}

export default useHandleBookNow
