"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import DestinationSearch from "./DestinationSearch";
import DateSelector from "./DateSelector";
import RoomsAndGuests from "./RoomsAndGuests";
import { format } from "date-fns";
import { toast } from "sonner";

export default function HotelSearch() {
    const t = useTranslations("Hotels.search");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Destination state
    const [destination, setDestination] = useState({
        name: "",
        id: null,
        type: null,
        country: null,
        countryCode: null,
    });

    // Date range state
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    // Rooms and guests state
    const [guests, setGuests] = useState({
        rooms: [{ adults: 2, children: 0, childrenAges: [] }],
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form from URL params (for results page)
    useEffect(() => {
        const name =
            searchParams.get("name") || searchParams.get("destination");
        const id =
            searchParams.get("id") ||
            searchParams.get("locationId") ||
            searchParams.get("hotelId");
        const type = searchParams.get("type") || "location";
        const country = searchParams.get("country");
        const countryCode = searchParams.get("countryCode");

        // Set destination if we have the required data
        if (name && id) {
            setDestination({
                name,
                id,
                type,
                country: country || "",
                countryCode: countryCode || "",
            });
        }

        // Set dates if available
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        if (checkIn && checkOut) {
            setDateRange({
                from: new Date(checkIn),
                to: new Date(checkOut),
            });
        }

        // Set rooms data if available
        const roomDetails = searchParams.get("roomDetails");
        if (roomDetails) {
            try {
                const parsedRooms = JSON.parse(roomDetails);
                if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
                    setGuests({
                        rooms: parsedRooms.map((r) => ({
                            adults: r.adults || 2,
                            children: r.childrenAges?.length || 0,
                            childrenAges: r.childrenAges || [],
                        })),
                    });
                }
            } catch (e) {
                console.error("Error parsing roomDetails:", e);
            }
        }
    }, [searchParams]);

    // Navigate to results page with all params in URL
    const handleSearch = () => {
        // Validation
        if (!destination.name?.trim()) {
            toast.error(
                t("error_no_destination") || "Please select a destination",
            );
            return;
        }

        if (!dateRange.from || !dateRange.to) {
            toast.error(
                t("error_no_dates") ||
                    "Please select check-in and check-out dates",
            );
            return;
        }

        if (!destination.id) {
            toast.error(
                t("error_select_destination") ||
                    "Please select a destination from the list",
            );
            return;
        }

        setIsLoading(true);

        // Calculate values
        const nights = Math.round(
            (dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24),
        );
        const totalAdults = guests.rooms.reduce((sum, r) => sum + r.adults, 0);
        const totalChildren = guests.rooms.reduce(
            (sum, r) => sum + r.children,
            0,
        );
        const childrenAges = guests.rooms.flatMap((r) => r.childrenAges || []);

        // Build URL params - all info needed for the API
        const params = new URLSearchParams({
            destination: destination.name,
            checkIn: format(dateRange.from, "yyyy-MM-dd"),
            checkOut: format(dateRange.to, "yyyy-MM-dd"),
            nights: nights.toString(),
            nationality: destination.countryCode || "AE",
            rooms: guests.rooms.length.toString(),
            adults: totalAdults.toString(),
            children: totalChildren.toString(),
            // location or hotel id
            ...(destination.type === "hotel"
                ? { hotelId: destination.id }
                : { locationId: destination.id }),
            name: destination.name,
            id: destination.id,
            type: destination.type,
            country: destination.country,
            countryCode: destination.countryCode,
        });

        // Add children ages if any
        if (childrenAges.length > 0) {
            params.set("childrenAges", childrenAges.join(","));
        }

        // Add room details as JSON for complex room data
        params.set(
            "roomDetails",
            JSON.stringify(
                guests.rooms.map((r) => ({
                    adults: r.adults,
                    childrenAges: r.childrenAges || [],
                })),
            ),
        );

        const newUrl = `/hotels/results?${params.toString()}`;

        // Check if already on results page
        const isOnResultsPage =
            window.location.pathname.includes("/hotels/results");

        if (isOnResultsPage) {
            // On results page - replace URL and refresh to trigger new search
            router.replace(newUrl);
            router.refresh();
            // Reset loading after a short delay (page will re-render with new data)
            setTimeout(() => setIsLoading(false), 500);
        } else {
            // From hotels page - navigate to results
            router.push(newUrl);
        }
    };

    return (
        <section className="md:border md:p-6 rounded-lg grid grid-cols-1 md:grid-cols-10 gap-2 justify-between md:shadow">
            <DestinationSearch
                value={destination}
                onChange={setDestination}
                t={t}
            />
            <DateSelector value={dateRange} onChange={setDateRange} t={t} />
            <RoomsAndGuests value={guests} onChange={setGuests} t={t} />

            {/* Desktop Button */}
            <Button
                className="font-bold col-span-3 md:col-span-1 md:w-auto h-auto cursor-pointer transition-colors rounded border border-accent-500 dark:border-accent-900 text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-500 hidden md:flex"
                variant="outline"
                onClick={handleSearch}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Search /> {t("search")}
                    </>
                )}
            </Button>

            {/* Mobile Button */}
            <Button
                className="font-bold col-span-3 md:col-span-1 md:w-auto h-auto cursor-pointer transition-colors rounded border bg-accent-500 text-white flex md:hidden"
                variant="default"
                onClick={handleSearch}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Search /> {t("search")}
                    </>
                )}
            </Button>
        </section>
    );
}
