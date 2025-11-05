"use client";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useCheckLocal from "../../_hooks/useCheckLocal";

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
                    <ArrowLeft className={`size-${size}`} />
                ) : (
                    <ArrowRight className={`size-${size}`} />
                )}
            </>
        );
}

export default ChevronBasedOnLanguage;
