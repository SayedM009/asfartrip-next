"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Wifi,
    Car,
    Dumbbell,
    Coffee,
    Waves,
    UtensilsCrossed,
    Tv,
    Wind,
    ShowerHead,
    Baby,
    Plane,
    ChevronDown,
    MonitorCheck,
    Umbrella,
    Sun,
    Presentation,
    WavesLadder,
    CoffeeIcon,
    Cigarette,
    WashingMachine,
    Newspaper,
    ShoppingBag,
    Rose,
    Gift,
    Scissors,
    Hospital,
    Luggage,
    Flame,
    HandHelping,
    Ticket,
    Calendar,
    RockingChair,
    CircleCheck,
    ConciergeBell,
    Languages,
    CreditCard,
    Joystick,
} from "lucide-react";

// Map facility names to icons
const facilityIcons = {
    transportation: Car,
    wifi: Wifi,
    parking: Car,
    fitness: Dumbbell,
    gym: Dumbbell,
    breakfast: Coffee,
    pool: Waves,
    swimming: Waves,
    restaurant: UtensilsCrossed,
    dining: UtensilsCrossed,
    tv: Tv,
    shower: ShowerHead,
    bath: ShowerHead,
    child: Baby,
    baby: Baby,
    airport: Plane,
    desk: MonitorCheck,
    loungers: RockingChair,
    umbrellas: Umbrella,
    sun: Sun,
    business: Presentation,
    pool: WavesLadder,
    coffee: CoffeeIcon,
    smoking: Cigarette,
    laundry: WashingMachine,
    newspapers: Newspaper,
    shopping: ShoppingBag,
    garden: Rose,
    gift: Gift,
    hair: Scissors,
    health: Hospital,
    luggage: Luggage,
    meeting: MonitorCheck,
    sauna: Flame,
    steam: Flame,
    spa: HandHelping,
    ticket: Ticket,
    year: Calendar,
    concierge: ConciergeBell,
    multilingual: Languages,
    air: Wind,
    bank: CreditCard,
    atm: CreditCard,
    game: Joystick,
};

function getIcon(facility) {
    const lowerFacility = facility.toLowerCase();
    for (const [key, Icon] of Object.entries(facilityIcons)) {
        if (lowerFacility.includes(key)) {
            return Icon;
        }
    }
    return CircleCheck; // Default icon
}

/**
 * Grid of hotel amenities/facilities
 * Desktop: Shows 12 items, Mobile: Shows 4 items
 * Click "Show All" to open a dialog with all amenities
 */
export default function AmenitiesGrid({ facilities = [] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Clean up facility names (remove leading spaces)
    const cleanFacilities = facilities.map((f) => f.trim());

    // Display count: 4 on mobile, 12 on desktop
    const displayCount = isMobile ? 4 : 12;
    const displayFacilities = cleanFacilities.slice(0, displayCount);
    const hasMore = cleanFacilities.length > displayCount;

    // Reusable amenity item component
    const AmenityItem = ({ facility, index }) => {
        const Icon = getIcon(facility);
        return (
            <div
                key={index}
                className="flex items-center gap-2 py-1 md:py-3 rounded-lg text-sm"
            >
                <Icon className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
                <span className="truncate">{facility}</span>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 md:gap-3">
                {displayFacilities.map((facility, index) => (
                    <AmenityItem
                        key={index}
                        facility={facility}
                        index={index}
                    />
                ))}
            </div>

            {hasMore && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="px-0 hover:bg-transparent cursor-pointer text-blue-500 dark:hover:bg-transparent"
                        >
                            Show All {cleanFacilities.length} Amenities
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl h-full md:max-h-[80vh] rounded-none md:rounded-lg">
                        <DialogHeader>
                            <DialogTitle className="ltr:text-left rtl:text-right">
                                All Amenities ({cleanFacilities.length})
                            </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto h-full md:max-h-[80vh] pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {cleanFacilities.map((facility, index) => (
                                    <AmenityItem
                                        key={index}
                                        facility={facility}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
