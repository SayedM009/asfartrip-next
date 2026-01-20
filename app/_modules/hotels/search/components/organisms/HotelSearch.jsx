"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DestinationSearch from "./DestinationSearch";
import DateSelector from "./DateSelector";
import RoomsAndGuests from "./RoomsAndGuests";
import { format } from "date-fns";

export default function HotelSearch() {
    const t = useTranslations("Hotels.search");
    const router = useRouter();

    // Centralized state
    const [destination, setDestination] = useState("");
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });
    const [guests, setGuests] = useState({
        rooms: [{ adults: 2, children: 0, childrenAges: [] }],
    });

    // Validation and search handler
    const handleSearch = () => {
        // Validation
        if (!destination.trim()) {
            // TODO: Show error message
            console.error("Please select a destination");
            return;
        }

        if (!dateRange.from || !dateRange.to) {
            console.error("Please select dates");
            return;
        }

        // Calculate totals
        const totalAdults = guests.rooms.reduce(
            (sum, room) => sum + room.adults,
            0,
        );
        const totalChildren = guests.rooms.reduce(
            (sum, room) => sum + room.children,
            0,
        );
        const allChildrenAges = guests.rooms.flatMap(
            (room) => room.childrenAges,
        );

        // Build query params
        const params = new URLSearchParams({
            destination: destination,
            checkIn: format(dateRange.from, "yyyy-MM-dd"),
            checkOut: format(dateRange.to, "yyyy-MM-dd"),
            rooms: guests.rooms.length.toString(),
            adults: totalAdults.toString(),
            children: totalChildren.toString(),
        });

        // Add children ages if any
        if (allChildrenAges.length > 0) {
            params.set("childrenAges", allChildrenAges.join(","));
        }

        // Add room details as JSON for complex data
        params.set("roomDetails", JSON.stringify(guests.rooms));

        // Navigate to results
        router.push(`/hotels/results?${params.toString()}`);
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

            <Button
                className="font-bold col-span-3 md:col-span-1 md:w-auto h-auto cursor-pointer transition-colors rounded border border-accent-500 dark:border-accent-900 text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-500 hidden md:flex"
                variant="outline"
                onClick={handleSearch}
            >
                <Search /> {t("search")}
            </Button>

            <Button
                className="font-bold col-span-3 md:col-span-1 md:w-auto h-auto cursor-pointer transition-colors rounded border bg-accent-500 text-white flex md:hidden"
                variant="default"
                onClick={handleSearch}
            >
                <Search /> {t("search")}
            </Button>
        </section>
    );
}
