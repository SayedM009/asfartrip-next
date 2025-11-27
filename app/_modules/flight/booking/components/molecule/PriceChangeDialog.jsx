import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import useBookingStore from "../../store/bookingStore";

export default function PriceChangeDialog() {
    const priceChangeData = useBookingStore((state) => state.priceChangeData);
    const clearPriceChangeData = useBookingStore((state) => state.clearPriceChangeData);
    const { formatPrice } = useCurrency();
    const t = useTranslations("Flight.operations");

    useEffect(() => {
        setTimeout(() => {
            clearPriceChangeData();
        }, 2000);
    }, []);
    
    if (!priceChangeData) return null;

    return (
        <Dialog open={!!priceChangeData} onOpenChange={(open) => !open && clearPriceChangeData()}>
            <DialogContent 
                className="sm:max-w-md" 
                onInteractOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-amber-600 flex items-center gap-2">
                         {t("price_change_title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("price_change_message")}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">{t("old_price")}</p>
                            <p className="text-lg font-medium line-through text-gray-400">
                                {formatPrice(priceChangeData?.oldPrice)}
                            </p>
                        </div>
                        <ChevronBasedOnLanguage size="15"/>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">{t("new_price")}</p>
                            <p className="text-lg font-bold text-primary">
                                {formatPrice(priceChangeData?.newPrice)}
                            </p>
                        </div>
                    </div>
                </div>

               
            </DialogContent>
        </Dialog>
    );
}
