"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FlightFilters({
    flights,
    selectedFilters,
    setSelectedFilters,
}) {
    const [showAllAirlines, setShowAllAirlines] = useState(false);
    const [showAllAirports, setShowAllAirports] = useState(false);

    // === 1. Stops counts ===
    const stopsCount = useMemo(() => {
        let nonStop = 0,
            oneStop = 0,
            twoStops = 0;
        flights.forEach((f) => {
            const stops = getStops(f);
            if (stops === 0) nonStop++;
            else if (stops === 1) oneStop++;
            else if (stops === 2) twoStops++;
        });
        return { nonStop, oneStop, twoStops };
    }, [flights]);

    // === 2. Fare type ===
    const fareTypeCount = useMemo(() => {
        let refundable = 0,
            nonRefundable = 0;
        flights.forEach((f) => {
            if (f.Refundable === "true") refundable++;
            else nonRefundable++;
        });
        return { refundable, nonRefundable };
    }, [flights]);

    // === 4. Airlines ===
    const airlines = useMemo(() => {
        const map = {};
        flights.forEach((f) => {
            f.segments?.forEach((s) => {
                map[s.Carrier] = (map[s.Carrier] || 0) + 1;
            });
        });
        return Object.entries(map); // [["EK",12],["QR",8]]
    }, [flights]);

    // === 7. Stopover Airports ===
    const airports = useMemo(() => {
        const map = {};
        flights.forEach((f) => {
            f.segments?.slice(1, -1).forEach((s) => {
                map[s.Origin] = (map[s.Origin] || 0) + 1;
            });
        });
        return Object.entries(map); // [["DOH",6],["IST",4]]
    }, [flights]);

    return (
        <Card className="p-4 space-y-6">
            <h2 className="font-bold text-lg">Filters</h2>
            {/* 1. Number of stops */}
            <Section title="Number of Stops">
                <FilterCheckbox
                    label={`Non-stop (${stopsCount.nonStop})`}
                    checked={selectedFilters.stops?.includes(0)}
                    onChange={() => toggleFilter("stops", 0)}
                />
                <FilterCheckbox
                    label={`1 Stop (${stopsCount.oneStop})`}
                    checked={selectedFilters.stops?.includes(1)}
                    onChange={() => toggleFilter("stops", 1)}
                />
                <FilterCheckbox
                    label={`2 Stops (${stopsCount.twoStops})`}
                    checked={selectedFilters.stops?.includes(2)}
                    onChange={() => toggleFilter("stops", 2)}
                />
            </Section>

            {/* 2. Fare type */}
            <Section title="Fare Type">
                <FilterCheckbox
                    label={`Refundable (${fareTypeCount.refundable})`}
                    checked={selectedFilters.fare?.includes("refundable")}
                    onChange={() => toggleFilter("fare", "refundable")}
                />
                <FilterCheckbox
                    label={`Non-Refundable (${fareTypeCount.nonRefundable})`}
                    checked={selectedFilters.fare?.includes("nonRefundable")}
                    onChange={() => toggleFilter("fare", "nonRefundable")}
                />
            </Section>

            {/* 3. Travel Time */}
            <Section title="Travel Time">
                {/* هنا تعمل checkboxes زي tripTimes بالظبط 
            لو O (one way) = departure فقط 
            لو R (round trip) = departure + return */}
            </Section>

            {/* 4. Airlines */}
            <Section title="Airlines">
                {(showAllAirlines ? airlines : airlines.slice(0, 5)).map(
                    ([code, n]) => (
                        <FilterCheckbox
                            key={code}
                            label={
                                <span className="flex items-center gap-2">
                                    <Image
                                        src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
                                        alt={code}
                                        width={20}
                                        height={20}
                                    />
                                    {code} ({n})
                                </span>
                            }
                            checked={selectedFilters.airlines?.includes(code)}
                            onChange={() => toggleFilter("airlines", code)}
                        />
                    )
                )}
                {airlines.length > 5 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllAirlines(!showAllAirlines)}
                    >
                        {showAllAirlines ? (
                            <>
                                Show Less <ChevronUp className="size-4" />
                            </>
                        ) : (
                            <>
                                Show More <ChevronDown className="size-4" />
                            </>
                        )}
                    </Button>
                )}
            </Section>

            {/* 5. Price Range */}
            <Section title="Price Range">
                <Slider
                    min={0}
                    max={2000}
                    step={50}
                    defaultValue={[200, 1500]}
                    className="my-2"
                />
            </Section>

            {/* 6. Duration */}
            <Section title="Duration">
                <Slider min={0} max={48} step={1} defaultValue={[0, 12]} />
            </Section>

            {/* 7. Stopover Airports */}
            <Section title="Stopover Airports">
                {(showAllAirports ? airports : airports.slice(0, 5)).map(
                    ([code, n]) => (
                        <FilterCheckbox
                            key={code}
                            label={`${code} (${n})`}
                            checked={selectedFilters.airports?.includes(code)}
                            onChange={() => toggleFilter("airports", code)}
                        />
                    )
                )}
                {airports.length > 5 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllAirports(!showAllAirports)}
                    >
                        {showAllAirports ? "Show Less" : "Show More"}
                    </Button>
                )}
            </Section>
        </Card>
    );

    // Helpers
    function toggleFilter(key, value) {
        setSelectedFilters((prev) => {
            const arr = prev[key] || [];
            return {
                ...prev,
                [key]: arr.includes(value)
                    ? arr.filter((x) => x !== value)
                    : [...arr, value],
            };
        });
    }
}

function Section({ title, children }) {
    return (
        <div>
            <h3 className="font-semibold text-sm mb-2">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function FilterCheckbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={checked} onCheckedChange={onChange} />
            <span>{label}</span>
        </label>
    );
}

// === Helpers ===
function getStops(flight) {
    const segs = flight?.segments || [];
    return Math.max(0, segs.length - 1);
}
