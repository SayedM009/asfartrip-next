"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useCheckLocal from "../_hooks/useCheckLocal";

function ChevronBasedOnLanguage() {
    const { isRTL } = useCheckLocal();
    return <>{isRTL ? <ChevronLeft /> : <ChevronRight />}</>;
}

export default ChevronBasedOnLanguage;
