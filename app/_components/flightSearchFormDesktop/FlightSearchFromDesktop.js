"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Search, Calendar as CalendarIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import TripType from "./TripType";
import MainSearchForm from "./MainSearchForm";
import Dates from "./Date";
import PassengersAndClass from "./PassengersAndClass";
import { safeParse } from "@/app/_helpers/safeParse";
import { toast } from "sonner";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "@/i18n/navigation";
import { format, parseISO } from "date-fns";

export function FlightSearchFormDesktop({ isLabel = true }) {
    const [tripType, setTripType] = useState("roundtrip");
    const [departure, setDeparture] = useState({});
    const [destination, setDestination] = useState({});
    const [departDate, setDepartDate] = useState(undefined > new Date());
    const [range, setRange] = useState({ from: null, to: null });
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [travelClass, setTravelClass] = useState("Economy");
    const t = useTranslations("Flight");
    const router = useRouter();

    // Avoid getting sessionStorage on server to skip an error
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

    async function handleSearch() {
        if (departure && destination && departure?.city === destination?.city) {
            toast.error(t("errors.same_city", { city: departure?.city }), {
                icon: <XCircleIcon className="text-red-500 text-sm" />,
            });
            return;
        }

        if (!departure) {
            toast.error(t("errors.departure_required"), {
                icon: <XCircleIcon className="text-red-500 text-sm" />,
            });
            return;
        }

        if (!destination) {
            toast.error(t("errors.destination_required"), {
                icon: <XCircleIcon className="text-red-500 text-sm" />,
            });
            return;
        }

        if (tripType === "oneway") {
            if (!departDate) {
                toast.error(t("errors.departure_date_required"), {
                    icon: <XCircleIcon className="text-red-500 text-sm" />,
                });
                return;
            }
        }

        if (tripType === "roundtrip") {
            if (!range?.from || !range?.to) {
                toast.error(t("errors.return_date_required"), {
                    icon: <XCircleIcon className="text-red-500 text-sm" />,
                });
                return;
            }
        }

        toast.success(t("operations.searching"), {
            icon: <CheckBadgeIcon className="text-green-500" />,
        });

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
        router.push(`/flights/search?${params.toString()}`);
    }

    return (
        <div className="bg-background">
            <div>
                <div className=" mx-auto">
                    {/* Search Form */}
                    <Card className="border shadow-sm">
                        <CardContent className="p-4">
                            {/* Trip Type Selection - Left Aligned */}
                            <TripType
                                tripType={tripType}
                                setTripType={setTripType}
                            />
                            {/* Main Search Form - All fields on one line */}
                            <div className="flex gap-3 items-end flex-wrap">
                                <MainSearchForm
                                    departure={departure}
                                    setDeparture={setDeparture}
                                    destination={destination}
                                    setDestination={setDestination}
                                    isLabel={isLabel}
                                />
                                {/* Dates - Combined for Round Trip */}
                                <Dates
                                    tripType={tripType}
                                    departDate={departDate}
                                    setDepartDate={setDepartDate}
                                    range={range}
                                    setRange={setRange}
                                    isLabel={isLabel}
                                />
                                {/* Passengers & Class */}
                                <PassengersAndClass
                                    passengers={passengers}
                                    setPassengers={setPassengers}
                                    travelClass={travelClass}
                                    setTravelClass={setTravelClass}
                                    isLabel={isLabel}
                                />
                                {/* Search Button - Redesigned */}
                                <div className="flex-shrink-0">
                                    <Button
                                        // className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
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
