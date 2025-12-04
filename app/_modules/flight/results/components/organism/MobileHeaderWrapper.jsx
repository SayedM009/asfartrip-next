"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";

import CurrencySwitcher from "@/app/_modules/currency/components/organisms/CurrencySwitcher";

import MobileHeaderEditDialog from "./MobileHeaderEditDialog";
import MobileHeaderSearchSummary from "./MobileHeaderSearchSummary";

import { getSafeSearchObject, parseDateString } from "../../utils/headerUtils";
import { BackWardButtonWithDirections } from "@/app/_components/layout/BackwardButton";

export default function MobileHeaderWrapper() {
    const params = useSearchParams();
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const [open, setOpen] = useState(false);

    const searchObject = getSafeSearchObject(params);
    if (!searchObject) return null;

    const {
        origin,
        destination,
        class: tripClass,
        type,
        ADT,
        CHD,
        INF,
        depart_date,
        return_date,
    } = searchObject;

    const totalPassengers = ADT + CHD + INF;
    const departDateObj = parseDateString(depart_date);
    const returnDateObj = parseDateString(return_date);

    const pattern = isRTL ? "dd MMMM" : "dd MMM";

    return (
        <div className="flex items-center justify-between gap-2">
            <BackWardButtonWithDirections href="/" />

            <MobileHeaderEditDialog open={open} setOpen={setOpen}>
                <button className="bg-background min-h-12 rounded-lg flex-1 flex flex-col justify-center border px-3">
                    <MobileHeaderSearchSummary
                        origin={origin}
                        destination={destination}
                        type={type}
                        isRTL={isRTL}
                        departDate={departDateObj}
                        returnDate={returnDateObj}
                        formatDate={formatDate}
                        pattern={pattern}
                        totalPassengers={totalPassengers}
                        tripClass={tripClass}
                    />
                </button>
            </MobileHeaderEditDialog>

            <div className="flex items-center">
                <CurrencySwitcher isLabel={false} />
            </div>
        </div>
    );
}
