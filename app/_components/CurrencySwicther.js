"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import useCheckLocal from "../_hooks/useCheckLocal";
import { useCurrency } from "../_hooks/useCurrency";

function CurrencySwitcher({ hiddenOnMobile = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("CurrencySwitcher");
    const { isRTL } = useCheckLocal();

    const { currency, changeCurrency } = useCurrency("AED");

    useEffect(() => {
        const saved = localStorage.getItem("currency");
        if (saved) changeCurrency(saved);
    }, [changeCurrency]);

    const handleApply = () => {
        localStorage.setItem("currency", currency);
        setIsOpen(false);
    };

    const currencies = [
        { code: "USD", name: t("currencies.us"), symbol: "$" },
        { code: "EUR", name: t("currencies.eu"), symbol: "€" },
        { code: "GBP", name: t("currencies.gbp"), symbol: "£" },
        { code: "CHF", name: t("currencies.chf"), symbol: "CHF" },
        { code: "AED", name: t("currencies.ae"), symbol: "AED" },
    ];

    const selectedCurrency = currencies.find((curr) => curr.code === currency);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`hover:bg-accent font-bold sm:flex dark:text-gray-50 justify-start gap-2 cursor-pointer ${
                        hiddenOnMobile ? "hidden sm:flex" : "flex w-85"
                    }`}
                    aria-label={t("title")}
                >
                    <DollarSign className="size-4" />
                    <span className="sm:hidden">{t("title")}</span>
                </Button>
            </DialogTrigger>

            <DialogContent dir={isRTL ? "rtl" : "ltr"}>
                <DialogHeader>
                    <DialogTitle>{t("select_currency")}</DialogTitle>
                </DialogHeader>

                <Select value={currency} onValueChange={changeCurrency}>
                    <SelectTrigger
                        className="w-full cursor-pointer"
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <SelectValue
                            placeholder={`${selectedCurrency?.symbol} ${selectedCurrency?.name}`}
                        />
                    </SelectTrigger>
                    <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                        <SelectGroup>
                            <SelectLabel>{t("select_currency")}</SelectLabel>
                            {currencies.map((curr) => (
                                <SelectItem key={curr.code} value={curr.code}>
                                    <div className="flex items-center space-x-2">
                                        <span>{curr.symbol}</span>
                                        <span>{curr.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div
                    className={`flex justify-end space-x-3 pt-4 ${
                        isRTL && "flex-row-reverse justify-start gap-2"
                    }`}
                >
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="hover:cursor-pointer hover:bg-input-background/90"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="hover:cursor-pointer hover:bg-input-background/20"
                    >
                        {t("apply")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CurrencySwitcher;
