"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";
import WegoSearchForm from "./WegoSearchForm";
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
            <DialogContent className="min-h-screen max-w-none rounded-none open-slide-right close-slide-right">
                <DialogHeader className="pt-5">
                    <DialogTitle className="text-left rtl:text-right">
                        {/* {f("search_flights")} */}
                    </DialogTitle>
                    <DialogDescription className="mt-4">
                        <WegoSearchForm />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default WegoSearchFormDialog;
