"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { InsuranceSearchForm } from "../templates";
import { cn } from "@/lib/utils";
import SearchSummary from "./SearchSummary";
import { useTranslations } from "next-intl";
import { useState } from "react";
function ResearchDialog() {
    const s = useTranslations("Insurance.results");
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className=" border flex-1 rounded-md text-center py-1">
                    <SearchSummary />
                </button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    " h-fit fixed bottom-0",
                    "open-slide-bottom close-slide-bottom",
                    "pt-4"
                )}
            >
                <DialogHeader>
                    <DialogTitle>{s("title")}</DialogTitle>
                    <DialogDescription>
                        <InsuranceSearchForm onClose={() => setOpen(false)} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default ResearchDialog;
