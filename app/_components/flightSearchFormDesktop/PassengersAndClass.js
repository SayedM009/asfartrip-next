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

    const getClassDisplayName = (className) => {
        switch (className) {
            case "economy":
                return "Economy";
            case "business":
                return "Business";
            case "first":
                return "First";
            default:
                return "Economy";
        }
    };

    const updatePassengers = (type, increment) => {
        setPassengers((prev) => {
            const currentCount = prev[type];
            let newCount;

            if (increment) {
                newCount = currentCount + 1;
            } else {
                newCount = Math.max(0, currentCount - 1);
            }

            // Ensure at least 1 adult and max 9 adults
            if (type === "adults") {
                if (newCount < 1) return prev;
                if (newCount > 9) return prev;
            }

            // Set max limits for other passenger types
            if (type === "children" && newCount > 8) return prev;
            if (type === "infants" && newCount > 4) return prev;

            // Limit total passengers to reasonable amount
            const newTotal = Object.keys(prev).reduce((sum, key) => {
                return sum + (key === type ? newCount : prev[key]);
            }, 0);

            if (newTotal > 15) return prev; // Max 15 total passengers

            const lastObj = {
                ...prev,
                [type]: newCount,
            };

            sessionStorage.setItem("flightPassengers", JSON.stringify(lastObj));
            return lastObj;
        });
    };

    function handleTravelClass(value) {
        setTravelClass(value);
        sessionStorage.setItem("travelClass", value);
    }

    const passengerConfig = [
        {
            key: "adults",
            label: "Adults",
            icon: User,
            description: "12+ years",
            min: 1,
            max: 9,
        },
        {
            key: "children",
            label: "Children",
            icon: Users,
            description: "2-11 years",
            min: 0,
            max: 8,
        },
        {
            key: "infants",
            label: "Infants",
            icon: Baby,
            description: "Under 2 years",
            min: 0,
            max: 4,
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
                                        ? "s"
                                        : ""}
                                    |{" "}
                                    {t(
                                        `ticket_class.${getClassDisplayName(
                                            travelClass
                                        ).toLocaleLowerCase()}`
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
                                        <SelectItem value="Economy">
                                            {t("ticket_class.economy")}
                                        </SelectItem>
                                        <SelectItem value="Business">
                                            {t("ticket_class.business")}
                                        </SelectItem>
                                        <SelectItem value="First">
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
                                        min,
                                        max,
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
                                                        passengers[key] <= min
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
                                                        passengers[key] >= max
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
