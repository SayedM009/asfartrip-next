"use client";
import { PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import SpinnerMini from "@/app/_components/ui/SpinnerMini";

export default function DestinationsContent({
    search,
    results,
    onDestination,
    onSearch,
    onShowResults,
    onIsSearching,
    popularDestinations,
    sessionKey,
    isLoading = false,
}) {
    const filteredObj = search
        ? results
        : popularDestinations.filter((dest) =>
              dest.city.toLowerCase().includes(search.toLowerCase())
          );

    const { locale, isRTL } = useCheckLocal();
    const dir = isRTL ? "rtl" : "ltr";
    const t = useTranslations("Flight");

    const handleSelect = (dest) => {
        // Validate before save
        if (dest && dest.label_code?.length === 3 && dest.city) {
            onDestination(dest);
            sessionStorage.setItem(
                sessionKey,
                JSON.stringify({
                    city: dest.city.trim(),
                    label_code: dest.label_code.toUpperCase(),
                    country: dest.country,
                    airport: dest.airport,
                })
            );
        }

        onSearch("");
        onShowResults(false);
        onIsSearching(false);
    };

    return (
        <PopoverContent
            className="w-80 p-0 mt-1"
            align="start"
            side="bottom"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            <ScrollArea className="h-64" dir={dir}>
                <div className="p-1">
                    {isLoading ? (
                        <div className="p-4 text-center flex items-center justify-center h-56">
                            <SpinnerMini />
                        </div>
                    ) : filteredObj.length > 0 ? (
                        filteredObj.map((dest) => (
                            <button
                                key={dest.label_code}
                                onClick={() => handleSelect(dest)}
                                className="w-full p-3 text-left hover:bg-muted rounded-md border-b last:border-0 cursor-pointer"
                                role="option"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col items-start">
                                        <div
                                            className={`font-medium ${
                                                locale === "ar" && "text-right"
                                            }`}
                                        >
                                            {dest.city},{" "}
                                            {dest.country.split("-").at(0)}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {dest.airport ||
                                                dest.country.split("-").at(1)}
                                        </div>
                                    </div>
                                    <div className="font-medium text-muted-foreground">
                                        {dest.label_code}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            {t("operations.no_results")}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </PopoverContent>
    );
}
