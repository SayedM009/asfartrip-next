"use client";
import React, { useState } from "react";
import { FlightTicket } from "./FlightTicket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Filter,
    SortDesc,
    ArrowUpDown,
    SunIcon,
    PlaneIcon,
    ArrowRightCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DisplayedCities } from "./MobileWrapper";

// Sample flight data
const sampleFlights = [
    // Direct flight
    {
        TotalPrice: 450,
        BasePrice: 350,
        Taxes: 100,
        SITECurrencyType: "AED",
        API_Currency: "AED",
        PlatingCarrier: "EK",
        FareType: "Non Refundable",
        Refundable: false,
        segments: [
            {
                Carrier: "EK",
                FlightNumber: "123",
                Origin: "DXB",
                Destination: "LHR",
                OriginAirport: "Dubai International Airport",
                DestinationAirport: "London Heathrow Airport",
                DepartureTime: "2025-10-01T08:30:00+04:00",
                ArrivalTime: "2025-10-01T13:45:00+01:00",
                Duration: "07:15",
                FlightTime: "435",
                OriginTerminal: "3",
                DestinationTerminal: "3",
                CabinClass: "Economy",
                Equipment: "A380",
            },
        ],
        CabinLuggage: "7 Kilograms",
        BaggageAllowance: ["NumberOfPieces 1"],
    },

    // 1 Stop flight (provided data)
    {
        TotalPrice: 840,
        BasePrice: 350,
        Taxes: 490,
        SITECurrencyType: "AED",
        API_Currency: "AED",
        PlatingCarrier: "HR",
        FareType: "Non Refundable",
        Refundable: false,
        segments: [
            {
                Carrier: "J2",
                FlightNumber: "12",
                Origin: "DXB",
                Destination: "GYD",
                OriginAirport: "Dubai international Airport",
                DestinationAirport: "Heydar Aliyev international Airport",
                DepartureTime: "2025-10-01T13:10:00+04:00",
                ArrivalTime: "2025-10-01T16:10:00+04:00",
                Duration: "03:00",
                FlightTime: "180",
                OriginTerminal: "1",
                DestinationTerminal: "1",
                CabinClass: "Economy",
                Equipment: "320",
            },
            {
                Carrier: "J2",
                FlightNumber: "805",
                Origin: "GYD",
                Destination: "VKO",
                OriginAirport: "Heydar Aliyev international Airport",
                DestinationAirport: "Vnukovo Airport",
                DepartureTime: "2025-10-01T20:30:00+04:00",
                ArrivalTime: "2025-10-01T22:50:00+03:00",
                Duration: "03:20",
                FlightTime: "200",
                OriginTerminal: "1",
                DestinationTerminal: "A",
                CabinClass: "Economy",
                Equipment: "320",
            },
        ],
        CabinLuggage: "7 Kilograms",
        BaggageAllowance: ["NumberOfPieces 0"],
    },

    // 2 Stops flight
    {
        TotalPrice: 650,
        BasePrice: 420,
        Taxes: 230,
        SITECurrencyType: "AED",
        API_Currency: "AED",
        PlatingCarrier: "TK",
        FareType: "Refundable",
        Refundable: true,
        segments: [
            {
                Carrier: "TK",
                FlightNumber: "763",
                Origin: "DXB",
                Destination: "IST",
                OriginAirport: "Dubai International Airport",
                DestinationAirport: "Istanbul Airport",
                DepartureTime: "2025-10-01T02:15:00+04:00",
                ArrivalTime: "2025-10-01T06:30:00+03:00",
                Duration: "04:15",
                FlightTime: "255",
                OriginTerminal: "1",
                DestinationTerminal: "I",
                CabinClass: "Economy",
                Equipment: "A330",
            },
            {
                Carrier: "TK",
                FlightNumber: "1985",
                Origin: "IST",
                Destination: "CDG",
                OriginAirport: "Istanbul Airport",
                DestinationAirport: "Charles de Gaulle Airport",
                DepartureTime: "2025-10-01T09:45:00+03:00",
                ArrivalTime: "2025-10-01T12:25:00+02:00",
                Duration: "03:40",
                FlightTime: "220",
                OriginTerminal: "I",
                DestinationTerminal: "1",
                CabinClass: "Economy",
                Equipment: "A321",
            },
            {
                Carrier: "AF",
                FlightNumber: "1234",
                Origin: "CDG",
                Destination: "JFK",
                OriginAirport: "Charles de Gaulle Airport",
                DestinationAirport: "John F. Kennedy International Airport",
                DepartureTime: "2025-10-01T16:20:00+02:00",
                ArrivalTime: "2025-10-01T19:45:00-04:00",
                Duration: "08:25",
                FlightTime: "505",
                OriginTerminal: "2E",
                DestinationTerminal: "1",
                CabinClass: "Economy",
                Equipment: "B777",
            },
        ],
        CabinLuggage: "8 Kilograms",
        BaggageAllowance: ["NumberOfPieces 2"],
    },

    // Another direct flight with different carrier
    {
        TotalPrice: 380,
        BasePrice: 300,
        Taxes: 80,
        SITECurrencyType: "AED",
        API_Currency: "AED",
        PlatingCarrier: "FZ",
        FareType: "Non Refundable",
        Refundable: false,
        segments: [
            {
                Carrier: "FZ",
                FlightNumber: "576",
                Origin: "DXB",
                Destination: "BOM",
                OriginAirport: "Dubai International Airport",
                DestinationAirport: "Chhatrapati Shivaji International Airport",
                DepartureTime: "2025-10-01T21:45:00+04:00",
                ArrivalTime: "2025-10-02T02:15:00+05:30",
                Duration: "03:00",
                FlightTime: "180",
                OriginTerminal: "2",
                DestinationTerminal: "2",
                CabinClass: "Economy",
                Equipment: "B737",
            },
        ],
        CabinLuggage: "7 Kilograms",
        BaggageAllowance: ["NumberOfPieces 1"],
    },
];

export function FlightResults({ flights = [] }) {
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [sortBy, setSortBy] = useState("price");
    const [filterBy, setFilterBy] = useState("all");

    const handleSelectFlight = (flightIndex) => {
        setSelectedFlight(`flight-${flightIndex}`);
        // Here you would typically handle the flight selection logic
        console.log("Selected flight:", flights[flightIndex]);
    };

    const filteredAndSortedFlights = React.useMemo(() => {
        let filtered = [...flights];

        // Apply filters
        if (filterBy === "direct") {
            filtered = filtered.filter(
                (flight) => flight.segments.length === 1
            );
        } else if (filterBy === "oneStop") {
            filtered = filtered.filter(
                (flight) => flight.segments.length === 2
            );
        } else if (filterBy === "multipleStops") {
            filtered = filtered.filter((flight) => flight.segments.length > 2);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price":
                    return a.TotalPrice - b.TotalPrice;
                case "duration":
                    // Calculate total duration for sorting
                    const aDuration =
                        new Date(
                            a.segments[a.segments.length - 1].ArrivalTime
                        ).getTime() -
                        new Date(a.segments[0].DepartureTime).getTime();
                    const bDuration =
                        new Date(
                            b.segments[b.segments.length - 1].ArrivalTime
                        ).getTime() -
                        new Date(b.segments[0].DepartureTime).getTime();
                    return aDuration - bDuration;
                case "departure":
                    return (
                        new Date(a.segments[0].DepartureTime).getTime() -
                        new Date(b.segments[0].DepartureTime).getTime()
                    );
                default:
                    return 0;
            }
        });

        return filtered;
    }, [flights, sortBy, filterBy]);

    const getFlightTypeStats = () => {
        const direct = flights.filter((f) => f.segments.length === 1).length;
        const oneStop = flights.filter((f) => f.segments.length === 2).length;
        const multipleStops = flights.filter(
            (f) => f.segments.length > 2
        ).length;
        return { direct, oneStop, multipleStops };
    };

    const stats = getFlightTypeStats();

    return (
        <div className=" mx-auto  space-y-6">
            {/* Header */}
            <FlightTabs
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                filteredAndSortedFlights={filteredAndSortedFlights}
            />
            {selectedFlight && (
                <Card className="border-primary bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-sm">
                            ✅ Flight Selected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            You&#39;ve selected flight {selectedFlight}.
                            Continue to booking details.
                        </p>
                        <Button className="mt-3" size="sm">
                            Continue to Booking
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function FlightTabs({ filterBy, setFilterBy, filteredAndSortedFlights }) {
    return (
        <Tabs value={filterBy} onValueChange={setFilterBy} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mt-3">
                <TabsTrigger value="all">
                    <SunIcon className="size-5" />
                    <span className="text-sm">Trip time</span>
                </TabsTrigger>
                <TabsTrigger value="airline">
                    <PlaneIcon className="size-5" />
                    <span className="text-sm">Airlines</span>
                </TabsTrigger>
                <TabsTrigger value="direct">
                    <ArrowRightCircleIcon className="size-5" />
                    <span className="text-sm">Direct</span>
                </TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between gap-2 px-2 mt-3">
                <DisplayedCities />
                <p className="text-sm capitalize flex items-center gap-2 text-muted-foreground">
                    {filteredAndSortedFlights.length} <span>flights found</span>
                </p>
            </div>

            <TabsContent value={filterBy} className="space-y-4 mt-0">
                {filteredAndSortedFlights.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="text-lg font-medium text-muted-foreground mb-2">
                                    No flights found
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your filters or search
                                    criteria
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredAndSortedFlights.map((flight, index) => (
                        <FlightTicket
                            key={`${filterBy}-flight-${index}`}
                            ticket={flight}
                            onSelect={() => handleSelectFlight(index)}
                        />
                    ))
                )}
            </TabsContent>
        </Tabs>
    );
}
