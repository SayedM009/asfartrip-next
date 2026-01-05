import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TextQuote } from "lucide-react";
import { tripTypes as TT } from "../../constants/tripTypes";
export default function TripTypes({ t, tripType, setTripType, isRTL }) {
    return (
        <>
            <label className="block mb-2 text-muted-foreground text-xs text-left rtl:text-right">
                {t("trip_type")}
            </label>
            <Select
                value={tripType}
                onValueChange={setTripType}
                dir={isRTL ? "rtl" : "ltr"}
            >
                <SelectTrigger
                    className="w-full  py-6 bg-input-background  font-medium cursor-pointer "
                    aria-label={t("select_trip_type")}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-stone-50   rounded-lg">
                            <TextQuote className="text-muted-foreground" />
                        </div>
                        <SelectValue
                            placeholder={t("select_trip_type")}
                            className=" font-medium placeholder:text-red-500"
                        />
                    </div>
                </SelectTrigger>
                <SelectContent
                    onPointerDownOutside={(e) => e.stopPropagation()}
                >
                    {Object.entries(TT).map(([title, items]) => (
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
