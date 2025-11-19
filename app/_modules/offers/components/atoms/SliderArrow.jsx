"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SliderArrow({ direction = "left", disabled, onClick }) {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;

    return (
        <Button
            variant="outline"
            size="icon"
            disabled={disabled}
            onClick={onClick}
        >
            <Icon className="w-4 h-4" />
        </Button>
    );
}
