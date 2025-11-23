import { PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import SpinnerMini from "@/app/_components/ui/SpinnerMini";
import DestinationOption from "../atoms/DestinationOption";

/**
 * DestinationList - Molecule Component
 * Displays a scrollable list of destination search results
 * 
 * @param {string} search - Current search query
 * @param {Array} results - Search results
 * @param {Array} popularDestinations - Popular destinations to show when no search
 * @param {function} onSelect - Callback when destination is selected
 * @param {boolean} isLoading - Whether results are loading
 */
export default function DestinationList({
    search,
    results,
    popularDestinations = [],
    onSelect,
    isLoading = false,
}) {
    const { isRTL } = useCheckLocal();
    const dir = isRTL ? "rtl" : "ltr";
    const t = useTranslations("Flight");

    // Show search results if searching, otherwise show popular destinations
    const filteredDestinations = search && search.trim().length > 0
        ? results
        : popularDestinations;

    const handleSelect = (destination) => {
        // Validate before selecting
        if (destination?.label_code?.length === 3 && destination.city) {
            onSelect(destination);
        }
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
                    ) : filteredDestinations.length > 0 ? (
                        filteredDestinations.map((dest) => (
                            <DestinationOption
                                key={dest.label_code}
                                destination={dest}
                                onClick={() => handleSelect(dest)}
                                isRTL={isRTL}
                            />
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            {t("operations.no_results")}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </PopoverContent>
    );
}
