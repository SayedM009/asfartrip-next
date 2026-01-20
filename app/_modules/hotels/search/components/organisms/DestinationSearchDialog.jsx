"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    XIcon,
    Loader2,
    Building2,
    FlagTriangleRight,
    BedDouble,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { POPULAR_DESTINATIONS } from "../../constants/popularDestinations";
import useCurrentLocation from "@/app/_hooks/useCurrentLocation";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function DestinationSearchDialog({
    value,
    handleMobileInputChange,
    t,
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    hasSearched,
    searchResults,
    handleSelectDestination,
}) {
    const {
        city: detectedCity,
        country: detectedCountry,
        isLoading: isDetectingLocation,
        error: locationError,
        permissionDenied,
        getCurrentLocation,
    } = useCurrentLocation();

    const handleCurrentLocationClick = () => {
        getCurrentLocation();
    };

    const handleDetectedCityClick = () => {
        if (detectedCity) {
            handleSelectDestination(detectedCity);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
                asChild
                className="col-span-3 border px-3 rounded-sm cursor-pointer py-2.5 md:py-0 block md:hidden"
            >
                <div className="col-span-3 border px-3 py-1 rounded-sm cursor-pointer">
                    <Label className="text-xs mb-1">{t("destination")}</Label>
                    {value ? (
                        <p className="text-sm font-bold capitalize">{value}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t("search_input_placeholder")}
                        </p>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent
                className="h-full w-full max-w-none overflow-y-auto border-0 rounded-none p-0 !top-0 !left-0 !translate-x-0 !translate-y-0 flex flex-col items-start justify-start"
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="w-full p-4 border-b bg-background text-left rtl:text-right sticky top-0 z-10">
                    <DialogTitle className="w-full flex items-center justify-between gap-2">
                        <Input
                            className="bg-transparent dark:bg-transparent py-5 flex-1"
                            placeholder={t("search_input_placeholder")}
                            type="search"
                            value={value}
                            onChange={handleMobileInputChange}
                            autoFocus
                        />
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon">
                                <XIcon className="h-4 w-4" />
                            </Button>
                        </DialogClose>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("destination_selection_helper")}
                    </DialogDescription>
                </DialogHeader>

                {/* Dialog Body - Search Results / Popular Destinations */}
                <div className="w-full flex-1">
                    {!value.trim() ? (
                        // Show Current Location + Popular Destinations
                        <div className="px-2">
                            {/* Current Location Section */}
                            <div className="mb-4 p-0">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 p-0 h-auto text-blue-500"
                                    onClick={handleCurrentLocationClick}
                                    disabled={isDetectingLocation}
                                >
                                    {isDetectingLocation ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <MapPinIcon className="h-4 w-4" />
                                    )}
                                    <span>
                                        {isDetectingLocation
                                            ? t("detecting_location")
                                            : t("current_location")}
                                    </span>
                                </Button>

                                {/* Detected City Result */}
                                {detectedCity && !isDetectingLocation && (
                                    <div
                                        className="mt-2 p-3 border-t cursor-pointer hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors"
                                        onClick={handleDetectedCityClick}
                                    >
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sm flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-blue-500" />
                                                {detectedCity},{" "}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {detectedCountry}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Permission Denied Message */}
                                {permissionDenied && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {t("location_permission_denied")}
                                    </p>
                                )}

                                {/* Other Error Message */}
                                {locationError && !permissionDenied && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {t("location_error")}
                                    </p>
                                )}
                            </div>

                            {/* Popular Destinations */}
                            <Label className="block text-sm font-bold text-muted-foreground mb-3">
                                {t("popular_destinations")}
                            </Label>
                            <div className="grid grid-cols-2">
                                {POPULAR_DESTINATIONS.map((dest) => (
                                    <div
                                        key={dest}
                                        className="p-3 bg-gray-50 dark:bg-muted cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors "
                                        onClick={() =>
                                            handleSelectDestination(dest)
                                        }
                                    >
                                        <div className="relative min-h-[100px]">
                                            <Image
                                                src={`/destinations/${dest}.webp`}
                                                alt={dest}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="font-medium text-sm flex items-center gap-1 mt-2 capitalize">
                                            <MapPinIcon className="h-4 w-4 text-blue-500" />{" "}
                                            {dest}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : isLoading ? (
                        // Loading State
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>{t("searching")}</span>
                            </div>
                        </div>
                    ) : hasSearched && searchResults.length === 0 ? (
                        // No Results
                        <div className="p-8 text-center text-muted-foreground">
                            <p className="text-base">{t("no_results")}</p>
                            <p className="text-sm mt-2">
                                {t("no_results_hint")}
                            </p>
                        </div>
                    ) : (
                        // Search Results
                        <div className="flex flex-col">
                            {searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-muted cursor-pointer border-b last:border-b-0 transition-colors flex items-center gap-3"
                                    onClick={() =>
                                        handleSelectDestination(result.name)
                                    }
                                >
                                    {result.type === "location" ? (
                                        <FlagTriangleRight className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                                    ) : (
                                        <BedDouble className="h-5 w-5 text-accent-500 mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {result.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {result.country}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
