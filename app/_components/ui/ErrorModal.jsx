"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Shared Error Modal component
 * Displays error messages in a modal dialog
 */
export default function ErrorModal({ isOpen, onClose, message, title }) {
    const t = useTranslations("Common");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-red-600 dark:text-red-400">
                            {title || t("error")}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <DialogDescription className="py-4 text-foreground">
                    {message || t("something_went_wrong")}
                </DialogDescription>

                <DialogFooter>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        {t("close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
