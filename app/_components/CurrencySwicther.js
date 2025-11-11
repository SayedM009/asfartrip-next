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
import { useTranslations } from "next-intl";
import { useState } from "react";
import useCheckLocal from "../_hooks/useCheckLocal";
import { useCurrency } from "../_context/CurrencyContext";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";

function CurrencySwitcher({ hiddenOnMobile = false, isLabel = true }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempCurrency, setTempCurrency] = useState("");
    const t = useTranslations("CurrencySwitcher");
    const { isRTL } = useCheckLocal();

    const { currentCurrency, updateCurrency, isLoading, error, exchangeRate } =
        useCurrency();

    const handleApply = () => {
        if (tempCurrency && tempCurrency !== currentCurrency) {
            updateCurrency(tempCurrency);
        }
        setIsOpen(false);
    };

    const handleOpenChange = (open) => {
        if (open) {
            setTempCurrency(currentCurrency);
        }
        setIsOpen(open);
    };

    const currencies = [
        { code: "AED", name: t("currencies.ae"), symbol: "/flags/uae.svg" },
        { code: "USD", name: t("currencies.us"), symbol: "/flags/usa.svg" },
        { code: "EUR", name: t("currencies.eu"), symbol: "/flags/europe.svg" },
        { code: "GBP", name: t("currencies.gbp"), symbol: "/flags/uk.svg" },
        { code: "SAR", name: t("currencies.sa"), symbol: "/flags/saudi.svg" },
        { code: "EGP", name: t("currencies.eg"), symbol: "/flags/egypt.svg" },
        { code: "QAR", name: t("currencies.qa"), symbol: "/flags/qatar.svg" },
        { code: "OMR", name: t("currencies.om"), symbol: "/flags/oman.svg" },
        { code: "TRY", name: t("currencies.tr"), symbol: "/flags/turkey.svg" },
        { code: "INR", name: t("currencies.in"), symbol: "/flags/india.svg" },
        {
            code: "PKR",
            name: t("currencies.pk"),
            symbol: "/flags/pakistan.svg",
        },
        {
            code: "PHP",
            name: t("currencies.ph"),
            symbol: "/flags/philippines.svg",
        },
        {
            code: "IDR",
            name: t("currencies.id"),
            symbol: "/flags/indonesia.svg",
        },
    ];

    const selectedCurrency = currencies.find(
        (curr) => curr.code === currentCurrency
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`hover:bg-accent font-bold sm:flex dark:text-gray-50 justify-start gap-2 cursor-pointer p-0 ${
                        hiddenOnMobile
                            ? "hidden sm:flex sm:w-10"
                            : "flex w-full"
                    }`}
                    aria-label={t("title")}
                >
                    {currentCurrency}
                    {isLabel && <span>{t("title")}</span>}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="rtl:text-right ">
                        {t("select_currency")}
                    </DialogTitle>
                    <DialogDescription
                        className={`text-gray-400 text-sm ${
                            isRTL ? "text-right" : "text-left"
                        }`}
                    >
                        {t("sub_title")}
                    </DialogDescription>
                </DialogHeader>

                <Select value={tempCurrency} onValueChange={setTempCurrency}>
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
                                        {/* <span>{curr.symbol}</span> */}
                                        <Image
                                            src={curr.symbol}
                                            alt={`${curr.name} currency + flag`}
                                            width={24}
                                            height={24}
                                            loading="lazy"
                                            className="size-5"
                                        />
                                        <span>{curr.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* عرض سعر الصرف */}
                {currentCurrency !== "AED" &&
                    exchangeRate !== 1 &&
                    !isLoading && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {t("exchange_rate")}: 1 AED ={" "}
                            {exchangeRate.toFixed(4)} {currentCurrency}
                        </div>
                    )}

                {/* عرض حالة التحميل */}
                {isLoading && (
                    <div className="text-sm text-blue-500 mt-2">
                        {t("loading")}...
                    </div>
                )}

                {error && (
                    <div className="text-sm text-red-500 mt-2">
                        {t("error_fetching_rate")}
                    </div>
                )}

                <div
                    className={`flex justify-end space-x-3 pt-4 ${
                        isRTL && "flex-row-reverse justify-start gap-2"
                    }`}
                >
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="hover:cursor-pointer hover:bg-input-background/90 py-5"
                        disabled={isLoading}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="bg-accent-500 hover:bg-accent-600 transition-colors cursor-pointer dark:text-white"
                        disabled={isLoading}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CurrencySwitcher;
