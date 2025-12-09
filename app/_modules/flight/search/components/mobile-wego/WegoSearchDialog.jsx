"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import WegoSearchForm from "./WegoSearchForm";
import { useSessionPersistence } from "../../hooks/useSessionPersistence";
import { SESSION_KEYS } from "../../constants/sessionKeys";

/**
 * WegoSearchDialog - Main entry point for Wego-style mobile flight search
 *
 * Features:
 * - Controlled dialog state from parent
 * - Clears From/To on close (per approved spec)
 * - Preserves trip type, dates, passengers, class
 */
export function WegoSearchDialog({ open, onOpenChange }) {
    const t = useTranslations("Flight");

    // Get setters for clearing From/To on close
    const [, setDeparture] = useSessionPersistence(SESSION_KEYS.DEPARTURE, {});
    const [, setDestination] = useSessionPersistence(
        SESSION_KEYS.DESTINATION,
        {}
    );

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            // Clear From/To on dialog close (approved behavior)
            setDeparture({});
            setDestination({});
        }
        onOpenChange?.(isOpen);
    };

    const handleSearchComplete = () => {
        // Close dialog after search is triggered
        onOpenChange?.(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="h-full w-full max-w-none rounded-none border-0 p-0 md:hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>{t("search_flights")}</DialogTitle>
                </DialogHeader>

                <WegoSearchForm onSearchComplete={handleSearchComplete} />
            </DialogContent>
        </Dialog>
    );
}

export default WegoSearchDialog;
