"use client";
import { ChevronLeft, ChevronRight, MoveLeft, MoveRight } from "lucide-react";
import useCheckLocal from "../_hooks/useCheckLocal";

function ChevronBasedOnLanguage({ icon = "chevron", size = "3" }) {
    const { isRTL } = useCheckLocal();
    if (icon === "chevron")
        return (
            <>
                {isRTL ? (
                    <ChevronLeft className={`size-${size}`} />
                ) : (
                    <ChevronRight className={`size-${size}`} />
                )}
            </>
        );
    if (icon === "arrow")
        return (
            <>
                {isRTL ? (
                    <MoveLeft className={`size-${size}`} />
                ) : (
                    <MoveRight className={`size-${size}`} />
                )}
            </>
        );
}

export default ChevronBasedOnLanguage;
