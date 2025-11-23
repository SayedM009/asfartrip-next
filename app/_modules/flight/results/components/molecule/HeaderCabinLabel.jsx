"use client";
import { useTranslations } from "next-intl";

export default function HeaderCabinLabel({ tripClass }) {
    const t = useTranslations("Flight");

    return (
        <span className="text-xs capitalize">
            {t(`ticket_class.${String(tripClass).toLowerCase()}`)}
        </span>
    );
}
