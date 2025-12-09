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
        // 1. Required Fields - Check these FIRST before same city validation
        if (!departure || !departure.label_code) {
            toast.error(t("errors.departure_required"));
            return false;
        }
        if (!destination || !destination.label_code) {
            toast.error(t("errors.destination_required"));
            return false;
        }

        // 2. Same City Validation - Only after we know both cities are selected
        if (departure.city === destination.city || departure.label_code === destination.label_code) {
            toast.error(t("errors.same_city", { city: departure.city || departure.label_code }));
            return false;
        }

        // 3. Date Validation
        if (tripType === "oneway") {
            if (!departDate) {
                toast.error(t("errors.departure_date_required"));
                return false;
            }
        } else {
            // Round-trip: check departure date first, then return date
            if (!range?.from) {
                toast.error(t("errors.departure_date_required"));
                return false;
            }
            if (!range?.to) {
                toast.error(t("errors.return_date_required"));
                return false;
            }
        }

        // 4. Logic Validation (using existing logic file if needed, or inline)
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
            toast.error(validation.errors[0]);
            return false;
        }

        return true;
    };

    return { validateSearch };
}

