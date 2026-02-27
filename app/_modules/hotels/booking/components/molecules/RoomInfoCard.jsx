"use client";

import { BedDouble, UtensilsCrossed, ShieldCheck, ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Room name + meal type + cancellation policy card
 */
export default function RoomInfoCard({ roomInfo }) {
    const t = useTranslations("Hotels.booking");

    if (!roomInfo?.name) return null;

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-primary-600 dark:text-primary-200">
                {t("room_details")}
            </h4>

            {/* Room Name */}
            <div className="flex items-center gap-2 text-sm">
                <BedDouble className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="line-clamp-1">{roomInfo.name}</span>
            </div>

            {/* Meal Type */}
            {roomInfo.mealType && (
                <div className="flex items-center gap-2 text-sm">
                    <UtensilsCrossed className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{roomInfo.mealType}</span>
                </div>
            )}

            {/* Cancellation Policy */}
            <div className="flex items-center gap-2 text-sm">
                {roomInfo.freeCancellation ? (
                    <>
                        <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-green-600 dark:text-green-400">
                            {t("free_cancellation")}
                        </span>
                    </>
                ) : (
                    <>
                        <ShieldX className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-red-500 dark:text-red-400">
                            {t("non_refundable")}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
