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
import Image from "next/image";
import WegoSearchForm from "./WegoSearchForm";
import { X } from "lucide-react";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
const WIDTH = 60;
const HEIGHT = 60;

function WegoSearchFormDialog() {
    const t = useTranslations("Services");
    const f = useTranslations("Flight");
    return (
        <Dialog>
            <DialogTrigger className=" text-center bg-background shadow-2xl px-12 rounded-xl py-2 cursor-pointer dark:bg-gray-900">
                <div>
                    <Image
                        src="/icons/wego-airplane.png"
                        alt="Book Flights"
                        width={WIDTH}
                        height={HEIGHT}
                        priority
                        fetchPriority="high"
                        loading="eager"
                    />

                    <span className="font-bold ">{t(`Flights`)}</span>
                </div>
            </DialogTrigger>
            <DialogContent
                className="min-h-screen max-w-none rounded-none open-slide-right close-slide-right"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogClose className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            <div className="rotate-180">
                                <ChevronBasedOnLanguage icon="arrow" size="5" />
                            </div>
                            <span className="sr-only">Close</span>
                        </DialogClose>
                        <DialogTitle className="text-left rtl:text-right">
                            {f("search_flights")}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="mt-6">
                        <WegoSearchForm />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default WegoSearchFormDialog;
