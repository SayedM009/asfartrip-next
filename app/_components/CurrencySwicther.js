"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

function CurrencySwicther({ hiddenOnMobile = false }) {
    const t = useTranslations("CurrencySwitcher");
    const [currency, setCurrency] = useState("USD");

    const currencies = [
        { code: "USD", name: t("CurrencySwitcher.currencies.us"), symbol: "$" },
        { code: "EUR", name: t("CurrencySwitcher.currencies.eu"), symbol: "€" },
        {
            code: "GBP",
            name: t("CurrencySwitcher.currencies.gbp"),
            symbol: "£",
        },
        {
            code: "CHF",
            name: t("CurrencySwitcher.currencies.chf"),
            symbol: "CHF",
        },
        {
            code: "AED",
            name: t("CurrencySwitcher.currencies.ae"),
            symbol: "AED",
        },
    ];

    const selectedCurrency = currencies.find((curr) => curr.code === currency);

    return null;
    return (
        <Dialog>
            <DialogTrigger className="p-0 w-full">
                <Button
                    variant="ghost"
                    size="sm"
                    className={` hover:bg-accent font-bold sm:flex dark:text-gray-50  justify-start gap-2 ${
                        hiddenOnMobile ? "hidden sm:flex" : "flex w-full"
                    }`}
                >
                    <DollarSign />
                    {t("title")}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        {/* Currency Selection */}
                        {/* <div>
            <Label className="text-sm mb-3 block">{t("select_currency")}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger
                className="w-full cursor-pointer"
                dir={condition && "rtl"}
              >
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {selectedCurrency?.symbol} {selectedCurrency?.name}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem
                    key={curr.code}
                    value={curr.code}
                    dir={condition && "rtl"}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{curr.symbol}</span>
                      <span>{curr.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CurrencySwicther;
