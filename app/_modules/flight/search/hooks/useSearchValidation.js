import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { validateSearchParams } from "../logic/validateSearchParams";

export function useSearchValidation() {
    const t = useTranslations("Flight");

    const validateSearch = ({
        departure,
        destination,
        tripType,
        departDate,
        range,
        passengers
    }) => {
        // 1. Same City Validation
        if (departure && destination && (departure.city === destination.city || departure.label_code === destination.label_code)) {
            toast.error(t("errors.same_city", { city: departure?.city || departure?.label_code }));
            return false;
        }

        // 2. Required Fields
        if (!departure) {
            toast.error(t("errors.departure_required"));
            return false;
        }
        if (!destination) {
            toast.error(t("errors.destination_required"));
            return false;
        }

        // 3. Date Validation
        if (tripType === "oneway" && !departDate) {
            toast.error(t("errors.departure_date_required"));
            return false;
        }
        if (tripType === "roundtrip" && (!range?.from || !range?.to)) {
            toast.error(t("errors.return_date_required"));
            return false;
        }

        // 4. Logic Validation (using existing logic file if needed, or inline)
        // The existing validateSearchParams seems to return an object with valid/errors.
        // We can use that for more complex rules if they exist.
        const validation = validateSearchParams({
            departure,
            destination,
            tripType,
            departDate,
            range,
            ADT: passengers?.adults,
            CHD: passengers?.children,
            INF: passengers?.infants,
        });

        if (!validation.valid) {
            // Show first error
            toast.error(validation.errors[0]);
            return false;
        }

        return true;
    };

    return { validateSearch };
}
