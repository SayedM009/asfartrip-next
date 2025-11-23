"use client";
import React, { useEffect, useState } from "react";
import { LucideLoader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { safeParse } from "@/app/_helpers/safeParse";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

// ✨ NEW: Import new atomic components
import TripTypeSelector from "./molecules/TripTypeSelector";
import PassengerClassPicker from "./organisms/PassengerClassPicker";
import DatePicker from "./organisms/DatePicker";
import MainSearchForm from "./desktop/MainSearchForm"; // Keep this for now (destinations)

/**
 * FlightSearchFormNew - NEW VERSION
 * Uses the new atomic design components
 * This is a drop-in replacement for FlightSearchFormDesktop
 */
export default function FlightSearchFormNew({ isLabel = true }) {
    // =============================
    // State Management (Same as old)
    // =============================
    const [tripType, setTripType] = useState("roundtrip");
    const [departure, setDeparture] = useState({});
    const [destination, setDestination] = useState({});
    const [departDate, setDepartDate] = useState(new Date());
    const [range, setRange] = useState({ from: null, to: null });
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [travelClass, setTravelClass] = useState("Economy");
    
    const t = useTranslations("Flight");
    const router = useRouter();

    // =============================
    // Load from sessionStorage
    // =============================
    useEffect(() => {
        setTripType(sessionStorage.getItem("tripType") || "roundtrip");
        setDeparture(safeParse(sessionStorage.getItem("departure"), ""));
        setDestination(safeParse(sessionStorage.getItem("destination"), ""));
        setDepartDate(safeParse(sessionStorage.getItem("departureDate"), null));
        setRange(
            safeParse(sessionStorage.getItem("rangeDate"), {
                from: null,
                to: null,
            })
        );
        setTravelClass(sessionStorage.getItem("travelClass") || "Economy");
        setPassengers(
            safeParse(sessionStorage.getItem("flightPassengers"), {
                adults: 1,
                children: 0,
                infants: 0,
            })
        );
    }, []);

    // =============================
    // Search Handler (Same as old)
    // =============================
    async function handleSearch() {
        // Validation
        if (departure && destination && departure?.city === destination?.city) {
            toast.error(t("errors.same_city", { city: departure?.city }));
            return;
        }

        if (!departure) {
            toast.error(t("errors.departure_required"));
            return;
        }

        if (!destination) {
            toast.error(t("errors.destination_required"));
            return;
        }

        if (tripType === "oneway") {
            if (!departDate) {
                toast.error(t("errors.departure_date_required"));
                return;
            }
        }

        if (tripType === "roundtrip") {
            if (!range?.from || !range?.to) {
                toast.error(t("errors.return_date_required"));
                return;
            }
        }

        toast.success(t("operations.searching"), {
            icon: <LucideLoader className="size-5 animate-spin" />,
        });

        // Build search object
        let searchObject;
        if (tripType === "oneway") {
            searchObject = {
                origin: departure.label_code,
                destination: destination.label_code,
                depart_date: format(departDate, "dd-MM-yyyy"),
                ADT: passengers.adults,
                CHD: passengers.children,
                INF: passengers.infants,
                class: travelClass,
                type: "O",
            };
        } else if (tripType === "roundtrip") {
            searchObject = {
                origin: departure.label_code,
                destination: destination.label_code,
                depart_date: format(range.from, "dd-MM-yyyy"),
                return_date: format(range.to, "dd-MM-yyyy"),
                ADT: passengers.adults,
                CHD: passengers.children,
                INF: passengers.infants,
                class: travelClass,
                type: "R",
            };
        }

        const params = new URLSearchParams();
        params.set("searchObject", JSON.stringify(searchObject));
        params.set("cities", JSON.stringify({ departure, destination }));
        router.push(`/flights/search?${params.toString()}`);
    }

    // =============================
    // Render (Using NEW components!)
    // =============================
    return (
        <div className="bg-background">
            <div>
                <div className="mx-auto">
                    <Card className="border shadow-sm">
                        <CardContent className="p-4">
                            {/* ✨ NEW: TripTypeSelector */}
                            <TripTypeSelector
                                tripType={tripType}
                                setTripType={setTripType}
                            />

                            <div className="flex gap-3 items-end flex-wrap">
                                {/* Keep MainSearchForm for now (destinations) */}
                                <MainSearchForm
                                    departure={departure}
                                    setDeparture={setDeparture}
                                    destination={destination}
                                    setDestination={setDestination}
                                    isLabel={isLabel}
                                />

                                {/* ✨ NEW: DatePicker (replaces Dates) */}
                                <DatePicker
                                    tripType={tripType}
                                    departDate={departDate}
                                    setDepartDate={setDepartDate}
                                    range={range}
                                    setRange={setRange}
                                    showLabel={isLabel}
                                />

                                {/* ✨ NEW: PassengerClassPicker (replaces PassengersAndClass) */}
                                <PassengerClassPicker
                                    passengers={passengers}
                                    setPassengers={setPassengers}
                                    travelClass={travelClass}
                                    setTravelClass={setTravelClass}
                                    showLabel={isLabel}
                                />

                                {/* Search Button (Same as old) */}
                                <div className="flex-shrink-0">
                                    <Button
                                        className="h-12 lg:ps-6 lg:pe-8 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer gap-2"
                                        onClick={handleSearch}
                                    >
                                        <Search className="mr-2 h-5 w-5" />
                                        {t("operations.search")}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
