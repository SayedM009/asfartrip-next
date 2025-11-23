"use client";
import { useTranslations } from "next-intl";

export default function HeaderPassengersLabel({ totalPassengers }) {
    const t = useTranslations("Flight");

    return (
        <span className="text-xs whitespace-nowrap">
            {totalPassengers}{" "}
            {totalPassengers > 1
                ? t("passengers.passengers")
                : t("passengers.passenger")}
        </span>
    );
}
