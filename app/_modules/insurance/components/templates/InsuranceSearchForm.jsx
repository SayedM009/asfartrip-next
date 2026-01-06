"use client";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { passengersData as PD } from "../../constants/passengers";

import Destinations from "../molecules/Destinations";
import TripTypes from "../molecules/TripTypes";
import Dates from "../molecules/Dates";
import Passengers from "../molecules/Passengers";
import useSearchValidation from "../../hooks/useSearchValidation";
import validTravelDate from "../../utils/validTravelDate";
import { extractDestinationCode } from "../../utils/extractDestinationCode";
import { extractCountryCode } from "../../utils/extractCountryCode";
import { useRouter } from "@/i18n/navigation";

function InsuranceSearchForm({ onClose }) {
    const [destination, setDestination] = useState("");
    const [tripType, setTripType] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [range, setRange] = useState({ from: null, to: null });
    const [passengers, setPassengers] = useState({
        adults: PD.adults.value,
        children: PD.children.value,
        seniors: PD.seniors.value,
    });
    const formatDate = useDateFormatter();
    const { isRTL } = useCheckLocal();
    const t = useTranslations("Insurance.search");
    const { validateSearch } = useSearchValidation();
    const router = useRouter();

    function handleSearch() {
        const isValid = validateSearch({
            destination,
            tripType,
            selectedDate,
            range,
            passengers,
        });

        if (!isValid) return;

        const searchParams = {
            region: extractDestinationCode(destination),
            tripType,
            dates: JSON.stringify(
                validTravelDate(tripType, selectedDate, range, formatDate)
            ),
            passengers: JSON.stringify(passengers),
            country: extractCountryCode(destination),
        };

        router.push(
            "/insurance/results?" + new URLSearchParams(searchParams).toString()
        );

        // Close research dialog on results page
        onClose?.();
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleSearch();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-9 gap-4 items-end md:border md:p-4 rounded-2xl md:shadow"
        >
            {/* Destination */}
            <div className="col-span-2">
                <Destinations
                    t={t}
                    destination={destination}
                    setDestination={setDestination}
                    isRTL={isRTL}
                />
            </div>
            {/* Trip type */}
            <div className="col-span-2">
                <TripTypes
                    t={t}
                    tripType={tripType}
                    setTripType={setTripType}
                    isRTL={isRTL}
                />
            </div>

            {/* Date */}
            <div className="col-span-2">
                <Dates
                    t={t}
                    tripType={tripType}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    range={range}
                    setRange={setRange}
                    formatDate={formatDate}
                    isRTL={isRTL}
                />
            </div>

            {/* Passengers */}
            <div className="col-span-2">
                <Passengers
                    t={t}
                    PD={PD}
                    passengers={passengers}
                    setPassengers={setPassengers}
                />
            </div>
            {/* Search Button */}
            <Button
                type="submit"
                className="w-full md:w-auto bg-accent-500 dark:bg-accent-500 dark:hover:bg-accent-600 text-white py-6 cursor-pointer hover:bg-accent-600 hover:text-white transition-colors col-span-2 md:col-span-1"
                variant="outline"
            >
                <SearchIcon className="h-4 w-4 text-white" />
                {t("search")}
            </Button>
        </form>
    );
}

export default InsuranceSearchForm;
