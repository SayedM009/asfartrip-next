import { Backpack, Luggage, Banknote } from "lucide-react";

export default function FlightConditions({
    t,
    CabinLuggage,
    BaggageAllowance,
    Refundable,
    formatBaggage,
}) {
    return (
        <div className="space-y-3">
            <h4 className="font-semibold">{t("dialog.flight_conditions")}</h4>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Backpack className="size-7 bg-blue-200 p-1 text-blue-900 rounded-md" />
                    <span>
                        {t("baggage.cabin_luggage")}:{" "}
                        {formatBaggage(CabinLuggage)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Luggage className="size-7 bg-green-200 p-1 text-green-900 rounded-md" />
                    <span>
                        {t("baggage.checked_baggage")}:{" "}
                        {formatBaggage(BaggageAllowance?.[0])}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Banknote className="size-7 bg-purple-200 p-1 text-purple-900 rounded-md" />
                    <span
                        className={
                            Refundable ? "text-green-600" : "text-red-600"
                        }
                    >
                        {Refundable
                            ? t("filters.refundable")
                            : t("filters.non_Refundable")}
                    </span>
                </div>
            </div>
        </div>
    );
}
