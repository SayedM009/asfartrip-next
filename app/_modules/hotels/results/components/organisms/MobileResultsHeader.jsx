"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import HotelSearch from "@/app/_modules/hotels/search/components/organisms/HotelSearch";
import { BackWardButtonWithDirections } from "@/app/_components/navigation/BackwardButton";
import CurrencySwitcher from "@/app/_modules/currency/components/organisms/CurrencySwitcher";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";

/**
 * Mobile results header with back button, search summary, and currency switcher
 * @param {Object} props
 * @param {string} props.city - City name
 * @param {string} props.checkIn - Check-in date
 * @param {string} props.checkOut - Check-out date
 * @param {number} props.nights - Number of nights
 * @param {number} props.rooms - Number of rooms
 * @param {number} props.guests - Total guests
 */
export default function MobileResultsHeader() {
    const router = useRouter();
    const t = useTranslations("Hotels.results");
    const searchParams = useSearchParams();
    const city = searchParams.get("destination");
    const country = searchParams.get("country");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    return (
        <div className="sticky top-0 z-50 bg-background md:hidden">
            <div className="flex items-center justify-between gap-3">
                {/* Back button */}
                <BackWardButtonWithDirections
                    onClick={() => router.back()}
                    className="flex-shrink-0"
                />

                {/* Search summary - opens edit dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="border flex-1 rounded-md text-center py-1">
                            <div className="text-xs  truncate flex gap-2 items-center justify-center ">
                                <p>
                                    {formatDisplayDate(checkIn, {
                                        pattern: "MMM d",
                                    })}{" "}
                                </p>

                                <p>
                                    {formatDisplayDate(checkOut, {
                                        pattern: "MMM d",
                                    })}
                                </p>
                            </div>
                            <p className="font-semibold text-sm truncate capitalize">
                                {city}, {country}
                            </p>
                        </button>
                    </DialogTrigger>
                    <DialogContent
                        className="max-w-none  p-0 w-[90%] rounded-xl gap-0"
                        showCloseButton={true}
                    >
                        <DialogHeader className="p-4 border-b gap-0">
                            <DialogTitle className="text-left rtl:text-right">
                                {t("edit_search")}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                            <HotelSearch />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Currency switcher */}
                <div className="flex-shrink-0">
                    <CurrencySwitcher isLabel={false} />
                </div>
            </div>
        </div>
    );
}
