"use client";

import { useState } from "react";
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
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import CurrencyOption from "../molecules/CurrencyOption";
import { useCurrency } from "../../hooks/useCurrency.js";

const CURRENCIES = [
    { code: "AED", nameKey: "ae", flag: "/flags/uae.svg" },
    { code: "USD", nameKey: "us", flag: "/flags/usa.svg" },
    { code: "EUR", nameKey: "eu", flag: "/flags/europe.svg" },
    { code: "GBP", nameKey: "gbp", flag: "/flags/uk.svg" },
    { code: "SAR", nameKey: "sa", flag: "/flags/saudi.svg" },
    { code: "EGP", nameKey: "eg", flag: "/flags/egypt.svg" },
    { code: "QAR", nameKey: "qa", flag: "/flags/qatar.svg" },
    { code: "OMR", nameKey: "om", flag: "/flags/oman.svg" },
    { code: "TRY", nameKey: "tr", flag: "/flags/turkey.svg" },
    { code: "INR", nameKey: "in", flag: "/flags/india.svg" },
    { code: "PKR", nameKey: "pk", flag: "/flags/pakistan.svg" },
    { code: "PHP", nameKey: "ph", flag: "/flags/philippines.svg" },
    { code: "IDR", nameKey: "id", flag: "/flags/indonesia.svg" },
];

export default function CurrencySwitcher({
    hiddenOnMobile = false,
    isLabel = true,
}) {
    const t = useTranslations("CurrencySwitcher");
    const { isRTL } = useCheckLocal();
    const { currentCurrency, updateCurrency, exchangeRate, isLoading, error } =
        useCurrency();

    const [open, setOpen] = useState(false);
    const [temp, setTemp] = useState(currentCurrency);

    const selected = CURRENCIES.find((c) => c.code === currentCurrency);

    const handleApply = () => {
        if (temp && temp !== currentCurrency) {
            updateCurrency(temp);
        }
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setTemp(currentCurrency);
                setOpen(o);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t("title")}
                    className={`font-bold gap-2 cursor-pointer p-0 dark:text-white 
                        ${
                            hiddenOnMobile
                                ? "hidden sm:flex sm:w-10"
                                : "flex w-full justify-start "
                        }`}
                >
                    {currentCurrency}
                    {isLabel && <span>{t("title")}</span>}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={isRTL ? "text-right" : "text-left"}>
                        {t("select_currency")}
                    </DialogTitle>
                    <p
                        className={`text-sm text-gray-400 ${
                            isRTL ? "text-right" : "text-left"
                        }`}
                    >
                        {t("sub_title")}
                    </p>
                </DialogHeader>

                {/* SELECT DROPDOWN */}
                <Select value={temp} onValueChange={setTemp} className="w-full">
                    <SelectTrigger
                        dir={isRTL ? "rtl" : "ltr"}
                        className="w-full"
                    >
                        <SelectValue placeholder={`${selected?.code}`} />
                    </SelectTrigger>

                    <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                        <SelectGroup>
                            <SelectLabel>{t("select_currency")}</SelectLabel>

                            {CURRENCIES.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                    <CurrencyOption
                                        flag={c.flag}
                                        label={t(`currencies.${c.nameKey}`)}
                                    />
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Exchange Rate */}
                {!isLoading && !error && currentCurrency !== "AED" && (
                    <div className="text-sm text-gray-600 mt-2">
                        {t("exchange_rate")}: 1 AED = {exchangeRate}{" "}
                        {currentCurrency}
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="text-sm text-blue-500 mt-2">
                        {t("loading")}...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-sm text-red-500 mt-2">
                        {t("error_fetching_rate")}
                    </div>
                )}

                {/* BUTTONS */}
                <div
                    className={`flex justify-end gap-2 pt-4 ${
                        isRTL && "flex-row-reverse justify-start"
                    }`}
                >
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        {t("cancel")}
                    </Button>

                    <Button
                        onClick={handleApply}
                        disabled={isLoading}
                        className="bg-accent-500 text-white hover:bg-accent-600 cursor-pointer"
                    >
                        {t("apply")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
