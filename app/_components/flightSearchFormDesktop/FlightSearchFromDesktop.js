"use client";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeftRight,
    Search,
    User,
    Users,
    Baby,
    MapPin,
    Calendar as CalendarIcon,
    Plane,
    Plus,
    Minus,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useLocale, useTranslations } from "next-intl";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";

// Popular destinations data
const popularDestinations = [
    {
        code: "NYC",
        city: "New York",
        country: "United States",
        airport: "John F. Kennedy International",
    },
    {
        code: "LON",
        city: "London",
        country: "United Kingdom",
        airport: "Heathrow Airport",
    },
    {
        code: "PAR",
        city: "Paris",
        country: "France",
        airport: "Charles de Gaulle Airport",
    },
    {
        code: "TOK",
        city: "Tokyo",
        country: "Japan",
        airport: "Narita International",
    },
    {
        code: "DXB",
        city: "Dubai",
        country: "United Arab Emirates",
        airport: "Dubai International",
    },
    {
        code: "SIN",
        city: "Singapore",
        country: "Singapore",
        airport: "Changi Airport",
    },
    {
        code: "LAX",
        city: "Los Angeles",
        country: "United States",
        airport: "Los Angeles International",
    },
    {
        code: "BCN",
        city: "Barcelona",
        country: "Spain",
        airport: "Barcelona-El Prat Airport",
    },
    {
        code: "SYD",
        city: "Sydney",
        country: "Australia",
        airport: "Sydney Kingsford Smith",
    },
    {
        code: "HKG",
        city: "Hong Kong",
        country: "Hong Kong",
        airport: "Hong Kong International",
    },
];

export function FlightSearchFormDesktop() {
    const [tripType, setTripType] = useState("roundtrip");
    const [departure, setDeparture] = useState("New York");
    const [destination, setDestination] = useState("London");
    const [departDate, setDepartDate] = useState(undefined > new Date());
    const [returnDate, setReturnDate] = useState(
        undefined > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [travelClass, setTravelClass] = useState("economy");

    // Search states
    const [departureSearch, setDepartureSearch] = useState("");
    const [destinationSearch, setDestinationSearch] = useState("");
    const [showDepartureResults, setShowDepartureResults] = useState(false);
    const [showDestinationResults, setShowDestinationResults] = useState(false);
    const [isSearchingDeparture, setIsSearchingDeparture] = useState(false);
    const [isSearchingDestination, setIsSearchingDestination] = useState(false);
    const [isSwapAnimating, setIsSwapAnimating] = useState(false);
    const t = useTranslations("Flight");
    const c = useTranslations("Calender");
    const local = useLocale();
    const dir = local === "ar" ? "rtl" : "ltr";
    const swapCities = () => {
        setIsSwapAnimating(true);
        const temp = departure;
        setDeparture(destination);
        setDestination(temp);
        setTimeout(() => setIsSwapAnimating(false), 300);
    };

    const totalPassengers =
        passengers.adults + passengers.children + passengers.infants;

    const getClassDisplayName = (className) => {
        switch (className) {
            case "economy":
                return "Economy";

            case "business":
                return "Business";
            case "first":
                return "First Class";
            default:
                return "Economy";
        }
    };

    const updatePassengers = (type, increment) => {
        setPassengers((prev) => ({
            ...prev,
            [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1),
        }));
    };

    const filteredDepartures = popularDestinations.filter(
        (dest) =>
            dest.city.toLowerCase().includes(departureSearch.toLowerCase()) ||
            dest.code.toLowerCase().includes(departureSearch.toLowerCase()) ||
            dest.country.toLowerCase().includes(departureSearch.toLowerCase())
    );

    const filteredDestinations = popularDestinations.filter(
        (dest) =>
            dest.city.toLowerCase().includes(destinationSearch.toLowerCase()) ||
            dest.code.toLowerCase().includes(destinationSearch.toLowerCase()) ||
            dest.country.toLowerCase().includes(destinationSearch.toLowerCase())
    );

    const handleDepartureSelect = (dest) => {
        setDeparture(dest.city);
        setDepartureSearch("");
        setShowDepartureResults(false);
        setIsSearchingDeparture(false);
    };

    const handleDestinationSelect = (dest) => {
        setDestination(dest.city);
        setDestinationSearch("");
        setShowDestinationResults(false);
        setIsSearchingDestination(false);
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="">
                <div className=" mx-auto">
                    {/* Search Form */}
                    <Card className="border shadow-sm">
                        <CardContent className="p-4">
                            {/* Trip Type Selection - Left Aligned */}
                            <div className="flex justify-start mb-4">
                                <div className="relative bg-muted rounded-lg p-1">
                                    {/* Sliding background */}
                                    <div
                                        className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-out"
                                        style={{
                                            left:
                                                tripType === "oneway"
                                                    ? "4px"
                                                    : "calc(50% + 2px)",
                                            width: "calc(50% - 6px)",
                                        }}
                                    />

                                    {/* Tab buttons */}
                                    <div className="relative flex">
                                        {["oneway", "roundtrip"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() =>
                                                    setTripType(type)
                                                }
                                                className={cn(
                                                    "px-4 py-2 font-medium transition-colors duration-200 rounded-md relative z-10",
                                                    tripType === type
                                                        ? "text-foreground"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {type === "oneway"
                                                    ? t("one_way")
                                                    : t("round_trip")}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Search Form - All fields on one line */}
                            <div className="flex gap-3 items-end">
                                {/* From City */}
                                <div className="flex-1">
                                    <label className="block mb-2 text-muted-foreground">
                                        {t("from")}
                                    </label>
                                    <Popover
                                        open={showDepartureResults}
                                        onOpenChange={setShowDepartureResults}
                                    >
                                        <PopoverTrigger asChild>
                                            <div
                                                className="relative cursor-pointer"
                                                onClick={() => {
                                                    setIsSearchingDeparture(
                                                        true
                                                    );
                                                    setShowDepartureResults(
                                                        true
                                                    );
                                                }}
                                            >
                                                {isSearchingDeparture ? (
                                                    <Input
                                                        value={departureSearch}
                                                        onChange={(e) =>
                                                            setDepartureSearch(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Search departure city"
                                                        className="h-12 pl-10 bg-input-background border-0"
                                                        autoFocus
                                                        onBlur={(e) => {
                                                            // Only close if we're not clicking on a result
                                                            if (
                                                                !e.relatedTarget?.closest(
                                                                    '[role="option"]'
                                                                )
                                                            ) {
                                                                setTimeout(
                                                                    () => {
                                                                        setIsSearchingDeparture(
                                                                            false
                                                                        );
                                                                        setDepartureSearch(
                                                                            ""
                                                                        );
                                                                        setShowDepartureResults(
                                                                            false
                                                                        );
                                                                    },
                                                                    100
                                                                );
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-12 bg-input-background rounded-md border-0 px-3 py-2 pl-10 flex items-center">
                                                        <span className="font-medium text-foreground">
                                                            {departure}
                                                        </span>
                                                    </div>
                                                )}
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-80 p-0"
                                            align="start"
                                            side="bottom"
                                            onOpenAutoFocus={(e) =>
                                                e.preventDefault()
                                            }
                                        >
                                            <ScrollArea className="h-64">
                                                <div className="p-1">
                                                    {filteredDepartures.map(
                                                        (dest) => (
                                                            <button
                                                                key={dest.code}
                                                                onClick={() =>
                                                                    handleDepartureSelect(
                                                                        dest
                                                                    )
                                                                }
                                                                className="w-full p-3 text-left hover:bg-muted rounded-md border-b last:border-0"
                                                                role="option"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            {
                                                                                dest.city
                                                                            }
                                                                            ,{" "}
                                                                            {
                                                                                dest.country
                                                                            }
                                                                        </div>
                                                                        <div className="text-muted-foreground">
                                                                            {
                                                                                dest.airport
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="font-medium text-muted-foreground">
                                                                        {
                                                                            dest.code
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Swap Button */}
                                <div className="flex justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={swapCities}
                                        className="h-10 w-10 rounded-full border"
                                    >
                                        <ArrowLeftRight
                                            className={cn(
                                                "h-4 w-4 transition-transform duration-300",
                                                isSwapAnimating && "rotate-180"
                                            )}
                                        />
                                    </Button>
                                </div>

                                {/* To City */}
                                <div className="flex-1">
                                    <label className="block mb-2 text-muted-foreground">
                                        {t("to")}
                                    </label>
                                    <Popover
                                        open={showDestinationResults}
                                        onOpenChange={setShowDestinationResults}
                                    >
                                        <PopoverTrigger asChild>
                                            <div
                                                className="relative cursor-pointer"
                                                onClick={() => {
                                                    setIsSearchingDestination(
                                                        true
                                                    );
                                                    setShowDestinationResults(
                                                        true
                                                    );
                                                }}
                                            >
                                                {isSearchingDestination ? (
                                                    <Input
                                                        value={
                                                            destinationSearch
                                                        }
                                                        onChange={(e) =>
                                                            setDestinationSearch(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Search destination city"
                                                        className="h-12 pl-10 bg-input-background border-0"
                                                        autoFocus
                                                        onBlur={(e) => {
                                                            // Only close if we're not clicking on a result
                                                            if (
                                                                !e.relatedTarget?.closest(
                                                                    '[role="option"]'
                                                                )
                                                            ) {
                                                                setTimeout(
                                                                    () => {
                                                                        setIsSearchingDestination(
                                                                            false
                                                                        );
                                                                        setDestinationSearch(
                                                                            ""
                                                                        );
                                                                        setShowDestinationResults(
                                                                            false
                                                                        );
                                                                    },
                                                                    100
                                                                );
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-12 bg-input-background rounded-md border-0 px-3 py-2 pl-10 flex items-center">
                                                        <span className="font-medium text-foreground">
                                                            {destination}
                                                        </span>
                                                    </div>
                                                )}
                                                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-80 p-0"
                                            align="start"
                                            side="bottom"
                                            onOpenAutoFocus={(e) =>
                                                e.preventDefault()
                                            }
                                        >
                                            <ScrollArea className="h-64">
                                                <div className="p-1">
                                                    {filteredDestinations.map(
                                                        (dest) => (
                                                            <button
                                                                key={dest.code}
                                                                onClick={() =>
                                                                    handleDestinationSelect(
                                                                        dest
                                                                    )
                                                                }
                                                                className="w-full p-3 text-left hover:bg-muted rounded-md border-b last:border-0"
                                                                role="option"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            {
                                                                                dest.city
                                                                            }
                                                                            ,{" "}
                                                                            {
                                                                                dest.country
                                                                            }
                                                                        </div>
                                                                        <div className="text-muted-foreground">
                                                                            {
                                                                                dest.airport
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="font-medium text-muted-foreground">
                                                                        {
                                                                            dest.code
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Dates - Combined for Round Trip */}
                                {tripType === "roundtrip" ? (
                                    <div className="flex-1">
                                        <label className="block mb-2 text-muted-foreground">
                                            {c("departure_date")} &{" "}
                                            {c("return_date")}
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="h-12 w-full justify-start bg-input-background border-0"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {formatDisplayDate(
                                                            departDate
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDisplayDate(
                                                            returnDate
                                                        )}
                                                    </span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-4"
                                                align="start"
                                                side="bottom"
                                            >
                                                <div className="flex gap-4">
                                                    <div>
                                                        <h4 className="font-medium mb-2 text-center">
                                                            {c(
                                                                "departure_date"
                                                            )}
                                                        </h4>
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                departDate
                                                            }
                                                            onSelect={
                                                                setDepartDate
                                                            }
                                                            initialFocus
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2 text-center">
                                                            {c("return_date")}
                                                        </h4>
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                returnDate
                                                            }
                                                            onSelect={
                                                                setReturnDate
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <label className="block mb-2 text-muted-foreground">
                                            {c("departure_date")}
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="h-12 w-full justify-start bg-input-background border-0"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {formatDisplayDate(
                                                            departDate
                                                        )}
                                                    </span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                                side="bottom"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={departDate}
                                                    onSelect={setDepartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}

                                {/* Passengers & Class */}
                                <div className="flex-1">
                                    <label className="block mb-2 text-muted-foreground">
                                        {t("passengers.passengers")} &{" "}
                                        {t("passengers.travel_class")}
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-12 w-full justify-between bg-input-background border-0"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium capitalize">
                                                        {totalPassengers}{" "}
                                                        {t(
                                                            "passengers.passengers"
                                                        )}
                                                        {totalPassengers !== 1
                                                            ? "s"
                                                            : ""}
                                                        ,{" "}
                                                        {getClassDisplayName(
                                                            travelClass
                                                        )}
                                                    </span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-80 p-4"
                                            align="end"
                                            side="bottom"
                                        >
                                            <div className="space-y-4">
                                                {/* Class Selection */}
                                                <div>
                                                    <label className="block mb-2 text-muted-foreground">
                                                        {t(
                                                            "passengers.travel_class"
                                                        )}
                                                    </label>
                                                    <Select
                                                        value={travelClass}
                                                        onValueChange={
                                                            setTravelClass
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            dir={dir}
                                                            className="bg-input-background border-0 w-full"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent
                                                            dir={dir}
                                                        >
                                                            <SelectItem value="economy">
                                                                {t(
                                                                    "ticket_class.economy"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="business">
                                                                {t(
                                                                    "ticket_class.business"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="first">
                                                                {t(
                                                                    "ticket_class.first"
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Passenger Counts */}
                                                <div className="space-y-3 ">
                                                    {[
                                                        {
                                                            key: "adults",
                                                            label: "Adults",
                                                            icon: User,
                                                            description:
                                                                "12+ years",
                                                        },
                                                        {
                                                            key: "children",
                                                            label: "Children",
                                                            icon: Users,
                                                            description:
                                                                "2-11 years",
                                                        },
                                                        {
                                                            key: "infants",
                                                            label: "Infants",
                                                            icon: Baby,
                                                            description:
                                                                "Under 2 years",
                                                        },
                                                    ].map(
                                                        ({
                                                            key,
                                                            label,
                                                            icon: Icon,
                                                            description,
                                                        }) => (
                                                            <div
                                                                key={key}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            {t(
                                                                                `passengers.${key}`
                                                                            )}
                                                                        </div>
                                                                        <div className="text-muted-foreground">
                                                                            {t(
                                                                                `passengers.${key}_description`
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            updatePassengers(
                                                                                key,
                                                                                false
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            passengers[
                                                                                key
                                                                            ] ===
                                                                            0
                                                                        }
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </Button>
                                                                    <span className="w-8 text-center font-medium">
                                                                        {
                                                                            passengers[
                                                                                key
                                                                            ]
                                                                        }
                                                                    </span>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            updatePassengers(
                                                                                key,
                                                                                true
                                                                            )
                                                                        }
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Search Button - Redesigned */}
                                <div className="flex-shrink-0">
                                    <Button className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
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
