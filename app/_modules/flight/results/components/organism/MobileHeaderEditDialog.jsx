"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FlightSearchForm } from "../../../search/components/mobile/FlightSearchFormMobile";

export default function MobileHeaderEditDialog({ open, setOpen, children }) {
    const t = useTranslations("Flight");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent
                className={cn(
                    "max-w-none w-full h-[45vh] top-179 rounded-none border-0",
                    "open-slide-bottom close-slide-bottom",
                    "pt-4"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-sm font-medium text-accent-400">
                        {t("operations.edit_your_search")}
                    </DialogTitle>
                    <DialogDescription>
                        <FlightSearchForm closeModal={setOpen} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
