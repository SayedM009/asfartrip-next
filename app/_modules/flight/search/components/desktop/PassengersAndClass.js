import { Button } from "@/components/ui/button";
import { Baby, ChevronDown, Minus, Plus, User, Users } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import {
    applyPassengerRules,
    canAddPassenger,
    canRemovePassenger,
} from "../../logic/applyPassengerRules";
import { normalizeClassName } from "../../utils/formatters";

export default function PassengersAndClass({
    passengers,
    setPassengers,
    travelClass,
    setTravelClass,
    isLabel,
}) {
    const { locale, isRTL } = useCheckLocal();
    const dir = isRTL ? "rtl" : "ltr";
    const t = useTranslations("Flight");
    const totalPassengers =
        passengers.adults + passengers.children + passengers.infants;

    const updatePassengers = (type, increment) => {
        setPassengers((prev) => {
            // CRITICAL: Check BEFORE making any changes
            if (increment && !canAddPassenger(type, prev)) {
                // Show visual feedback that action is blocked
                return prev;
            }
            if (!increment && !canRemovePassenger(type, prev)) {
                return prev;
            }

            // Calculate new value
            let newValue = increment
                ? prev[type] + 1
                : Math.max(0, prev[type] - 1);

            // Create updated object with the change
            let updated = {
                ...prev,
                [type]: newValue,
            };

            // Apply passenger rules to handle edge cases
            // (like reducing adults when infants > adults)
            updated = applyPassengerRules({
                ADT: updated.adults,
                CHD: updated.children,
                INF: updated.infants,
            });

            return updated;
        });
    };

    const handleTravelClass = (value) => {
        setTravelClass(value);
    };

    const passengerConfig = [
        {
            key: "adults",
            label: "Adults",
            icon: User,
            description: "12+ years",
        },
        {
            key: "children",
            label: "Children",
            icon: Users,
            description: "2-11 years",
        },
        {
            key: "infants",
            label: "Infants",
            icon: Baby,
            description: "Under 2 years",
        },
    ];

    return (
        <>
            <div className="flex-1">
                {isLabel && (
                    <label className="block mb-2 text-muted-foreground text-xs">
                        {t("passengers.passengers")} &{" "}
                        {t("passengers.travel_class")}
                    </label>
                )}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-12 w-full justify-between bg-input-background border-0 cursor-pointer "
                        >
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium capitalize">
                                    {totalPassengers}{" "}
                                    {t("passengers.passengers")}
                                    {totalPassengers !== 1 && locale !== "ar"
                                        ? ""
                                        : ""}
                                    |{" "}
                                    {t(
                                        `ticket_class.${normalizeClassName(
                                            travelClass
                                        )}`
                                    )}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-80 p-4 mt-1"
                        align="end"
                        side="bottom"
                    >
                        <div className="space-y-4">
                            {/* Class Selection */}
                            <div>
                                <label className="block mb-2 text-muted-foreground">
                                    {t("passengers.travel_class")}
                                </label>
                                <Select
                                    value={travelClass}
                                    onValueChange={(e) => handleTravelClass(e)}
                                >
                                    <SelectTrigger
                                        dir={dir}
                                        className="bg-input-background border-0 w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent dir={dir}>
                                        <SelectItem value="economy">
                                            {t("ticket_class.economy")}
                                        </SelectItem>
                                        <SelectItem value="business">
                                            {t("ticket_class.business")}
                                        </SelectItem>
                                        <SelectItem value="first">
                                            {t("ticket_class.first")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Passenger Counts */}
                            <div className="space-y-3 ">
                                {passengerConfig.map(
                                    ({
                                        key,
                                        label,
                                        icon: Icon,
                                        description,
                                    }) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <div className="font-medium">
                                                        {t(`passengers.${key}`)}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {t(
                                                            `passengers.${key}_description`
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        updatePassengers(
                                                            key,
                                                            false
                                                        )
                                                    }
                                                    disabled={
                                                        !canRemovePassenger(
                                                            key,
                                                            passengers
                                                        )
                                                    }
                                                    className="h-8 w-8 cursor-pointer"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center font-medium ">
                                                    {passengers[key]}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        updatePassengers(
                                                            key,
                                                            true
                                                        )
                                                    }
                                                    disabled={
                                                        !canAddPassenger(
                                                            key,
                                                            passengers
                                                        )
                                                    }
                                                    className="h-8 w-8 cursor-pointer"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}
