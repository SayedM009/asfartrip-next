import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import PayInInstallments from "../../PayInInstallments";
import LoyaltyPoints from "../../loyaltyPoints/LoyaltyPoints";
import FareSummarySidebar from "./FareSummarySidebar";
import useBookingStore from "@/app/_store/bookingStore";

export default function FareSummaryDialog() {
    const { getTotalPrice } = useBookingStore();
    const t = useTranslations("Flight");
    const { formatPrice } = useCurrency();
    const dynamicTotal = getTotalPrice();
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <div className="flex items-center justify-between gap-4 mb-3 w-full">
                    <div className="flex flex-col gap-1">
                        <LoyaltyPoints price={dynamicTotal} />
                        <PayInInstallments />
                    </div>
                    <div className="flex flex-col justify-start ">
                        <div className="text-xs font-semibold flex items-center gap-2">
                            {t("booking.total_fare")}
                            <ChevronUp className="size-5" />
                        </div>
                        <div className="text-xl text-accent-500 font-semibold flex justify-end">
                            {formatPrice(dynamicTotal)}
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-none h-[90vh] overflow-y-auto fixed top-150 open-slide-bottom close-slide-bottom py-10">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                        <FareSummarySidebar />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
