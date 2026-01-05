"use client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

function useSearchValidation() {
    const t = useTranslations("Insurance.search");
    return {
        validateSearch: (searchParams) => {
            if (!searchParams.destination) {
                toast.warning(t("errors.destination_required"));
                return false;
            }
            if (!searchParams.tripType) {
                toast.warning(t("errors.trip_type_required"));
                return false;
            }
            if (!searchParams.selectedDate && searchParams.tripType !== "single") {
                toast.warning(t("errors.dates_required"));
                return false;
            }
            if (!searchParams.range.from && searchParams.tripType === "single") {
                toast.warning(t("errors.travel_date_required"));
                return false;
            }
            if (!searchParams.range.to && searchParams.tripType === "single") {
                toast.warning(t("errors.return_date_required"));
                return false;
            }
            if (!searchParams.passengers.adults && !searchParams.passengers.children && !searchParams.passengers.seniors) {
                toast.warning(t("errors.passengers_required"));
                return false;
            }
            return true;
        }
    }
}

export default useSearchValidation
