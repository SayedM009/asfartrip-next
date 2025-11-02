"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "../ui/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import Logo from "../Logo";
import EmailInput from "./EmailInput";

export default function AuthDialog({ primary }) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "icons-hover-600 border-1 flex text-sm px-3 py-0 rounded border-gray-500",
                            primary &&
                                "bg-accent-500 text-white border-0 hover:bg-accent-600 hover:text-white transition-colors dark:bg-accent-500 dark:hover:bg-accent-600"
                        )}
                    >
                        {t("Login.title")}
                    </Button>
                </DialogTrigger>

                <DialogContent
                    className={cn(
                        "dialog-bg",
                        "max-w-none w-full h-full rounded-none border-0  md:h-11/12 md:rounded",
                        "open-slide-right",
                        "close-slide-right"
                    )}
                >
                    <DialogHeader>
                        <DialogTitle className="flex justify-center">
                            <div className="w-20">
                                <Logo />
                            </div>
                        </DialogTitle>

                        <DialogDescription>
                            <EmailInput parentSetOpen={setOpen} />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
