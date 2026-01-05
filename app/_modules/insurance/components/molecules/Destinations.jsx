import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plane } from "lucide-react";
import { destinationsCountries as DC } from "../../constants/destinations";
export default function Destinations({
    t,

    destination,
    setDestination,
    isRTL,
}) {
    return (
        <>
            <label className="block mb-2 text-muted-foreground text-xs text-left rtl:text-right">
                {t("select_destination")}
            </label>
            <Select
                value={destination}
                onValueChange={setDestination}
                dir={isRTL ? "rtl" : "ltr"}
            >
                <SelectTrigger
                    className="w-full py-6 bg-input-background  font-medium cursor-pointer"
                    aria-label={t("select_destination")}
                >
                    <div className="flex items-center gap-4  ">
                        <div className="p-2 bg-stone-50   rounded-lg">
                            <Plane className="w-5 h-5 " />
                        </div>
                        <SelectValue placeholder={t("select_destination")} />
                    </div>
                </SelectTrigger>
                <SelectContent
                    className="max-h-[500px] overflow-y-auto"
                    onPointerDownOutside={(e) => e.stopPropagation()}
                >
                    {Object.entries(DC).map(([title, items]) => (
                        <SelectGroup key={title}>
                            <SelectLabel>{t(title)}</SelectLabel>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {t(item.label)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
