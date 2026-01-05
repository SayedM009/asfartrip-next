"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import InsuranceSearchForm from "./InsuranceSearchForm";

function InsuranceDialog() {
    const t = useTranslations("Services");
    return (
        <Dialog>
            <DialogTrigger>
                <div className="flex flex-col  items-center gap-2 ">
                    <div className="bg-accent-500  p-4 rounded-full ">
                        <ShieldPlus className=" text-white" />
                    </div>
                    <span className="font-bold text-center">
                        {t(`Insurance`)}
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent
                className=" bg-background h-full w-full max-w-none rounded-none border-0 p-3 overflow-y-auto open-slide-right close-slide-right"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex justify-between flex-row-reverse gap-2 items-center">
                        <DialogClose className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ">
                            <div className="rotate-180 ">
                                <X />
                            </div>
                            <span className="sr-only">Close</span>
                        </DialogClose>
                        <DialogTitle>{t("Insurance")}</DialogTitle>
                    </div>
                    <DialogDescription className="mt-5">
                        <InsuranceSearchForm />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default InsuranceDialog;
