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
import { Globe } from "lucide-react";
import { useState } from "react";
import useCheckLocal from "../_hooks/useCheckLocal";

function LanguageSwitcher({ hiddenOnMobile = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, isRTL } = useCheckLocal();
    const [currentLanguage, setCurrentLanguage] = useState(locale);
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("Languageswitcher");

    //   Handle switcher
    function handleSwitch(locale) {
        const nextLocale = locale;
        const segments = pathname.split("/");
        segments[1] = nextLocale;
        const newPath = segments.join("/");
        router.push(newPath);
        setIsOpen(false);
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

    const selectedLanguage = languages.find(
        (lang) => lang.code === currentLanguage
    );
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={` items-center hover:bg-accent font-bold sm:flex dark:text-gray-50  cursor-pointer ${
                        hiddenOnMobile ? "hidden sm:flex" : "flex"
                    }`}
                >
                    <Globe className="svg" />
                    <span>{selectedLanguage?.name.toUpperCase()}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-black border-0">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-gray-50" />
                        <span className="text-gray-50">{t("title")}</span>
                    </DialogTitle>
                    <DialogDescription
                        className={`text-gray-400 ${isRTL && "text-right"}`}
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
                            value={currentLanguage}
                            onValueChange={(e) => setCurrentLanguage(e)}
                            className={`${isRTL && "text-right"} `}
                        >
                            <SelectTrigger
                                className="w-full  cursor-pointer"
                                dir={isRTL && "rtl"}
                            >
                                <SelectValue>
                                    <div className="flex items-center space-x-2 uppercase">
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
                                        dir={isRTL && "rtl"}
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
                            onClick={() => handleSwitch(currentLanguage)}
                            className="hover:cursor-pointer hover:bg-input-background/20"
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
