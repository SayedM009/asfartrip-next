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
import { useTranslations } from "next-intl";
import { SkyscannerSearchShell } from ".";
import { Plane, X } from "lucide-react";

function SkyScannerSearchFormDialog() {
    const t = useTranslations("Services");
    return (
        <Dialog>
            <DialogTrigger>
                <div className="flex flex-col  items-center gap-2 ">
                    <div className="bg-accent-500  p-4 rounded-full ">
                        <Plane className="rotate-45 text-white" />
                    </div>
                    <span className="font-bold ">{t(`Flights`)}</span>
                </div>
            </DialogTrigger>
            <DialogContent
                className=" bg-background h-full w-full max-w-none rounded-none border-0 p-3 overflow-y-auto open-slide-right close-slide-right"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex justify-end gap-2">
                        <DialogClose className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ">
                            <div className="rotate-180 ">
                                <X />
                            </div>
                            <span className="sr-only">Close</span>
                        </DialogClose>
                        <DialogTitle className="text-left rtl:text-right">
                            {/* {f("search_flights")} */}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        <SkyscannerSearchShell />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default SkyScannerSearchFormDialog;
