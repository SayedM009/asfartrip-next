"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Globe, DollarSign } from "lucide-react";
import { useState } from "react";

function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split("/")[1] || "en";
  const t = useTranslations("Languageswitcher");

  const condition = currentLocale == "ar";
  //   Handle switcher
  function handleSwitch(locale) {
    const nextLocale = locale;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  }
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇦🇪" },
    // { code: "fr", name: "Français", flag: "🇫🇷" },
    // { code: "de", name: "Deutsch", flag: "🇩🇪" },
    // { code: "it", name: "Italiano", flag: "🇮🇹" },
    // { code: "pt", name: "Português", flag: "🇧🇷" },
    // { code: "zh", name: "中文", flag: "🇨🇳" },
    // { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const currencies = [
    { code: "USD", name: t("currencies.us"), symbol: "$" },
    { code: "EUR", name: t("currencies.eu"), symbol: "€" },
    { code: "GBP", name: t("currencies.gbp"), symbol: "£" },
    { code: "CHF", name: t("currencies.chf"), symbol: "CHF" },
    { code: "AED", name: t("currencies.ae"), symbol: "AED" },
  ];
  const selectedLanguage = languages.find(
    (lang) => lang.code === currentLocale
  );
  const selectedCurrency = currencies.find((curr) => curr.code === currency);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className=" icons-hover-600">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center hover:bg-accent"
        >
          <Globe className="svg" />
          <span className="hidden sm:inline  hover:cursor-pointer ">
            {selectedLanguage?.code.toUpperCase()} | {selectedCurrency?.symbol}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-50" />
            <span className="text-gray-50">{t("title")}</span>
          </DialogTitle>
          <DialogDescription
            className={`text-gray-400 ${condition && "text-right"}`}
          >
            {t("sub_title")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <Label className="text-sm mb-3 block text-gray-50">
              {t("select_language")}
            </Label>
            <Select
              value={currentLocale}
              onValueChange={(e) => handleSwitch(e)}
              className={`${condition && "text-right"} `}
            >
              <SelectTrigger
                className="w-full  cursor-pointer"
                dir={condition && "rtl"}
              >
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <span>{selectedLanguage?.flag}</span>
                    <span>{selectedLanguage?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.code}
                    dir={condition && "rtl"}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Currency Selection */}
          <div>
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
          </div>

          <div
            className={`flex justify-end space-x-3 pt-4 ${
              condition && "flex-row-reverse justify-start gap-2"
            }`}
          >
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="hover:cursor-pointer "
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="hover:cursor-pointer hover:bg-accent hover:text-background"
            >
              {t("apply")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LanguageSwitcher;
