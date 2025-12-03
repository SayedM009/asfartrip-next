"use client";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useLanguage } from "../../hooks/useLanguage";
import useCheckLocal from "@/app/_hooks/useCheckLocal";

function LanguageSwitcher({ hiddenOnMobile = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, isRTL } = useCheckLocal();
    const [currentLanguage, setCurrentLanguage] = useState(locale);

    const t = useTranslations("Languageswitcher");
    const { switchLang } = useLanguage();

    const languages = [
        { code: "en", name: "English", flag: "/flags/usa.svg" },
        { code: "ar", name: "العربية", flag: "/flags/uae.svg" },
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
                    className={`sm:items-center hover:bg-accent font-bold sm:flex dark:text-gray-50 cursor-pointer w-full sm:w-auto justify-start ${
                        hiddenOnMobile ? "hidden sm:flex" : "flex"
                    }`}
                >
                    <Image
                        src={selectedLanguage?.flag}
                        alt={`Selected Language is ${selectedLanguage?.name}`}
                        width={25}
                        height={25}
                        loading="lazy"
                    />
                    <span className="sm:hidden">
                        {selectedLanguage?.name.toUpperCase()}
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md border-0">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Globe className="size-5" />
                        <span>{t("title")}</span>
                    </DialogTitle>
                    <DialogDescription
                        className={`text-gray-400 ${
                            isRTL ? "text-right" : "text-left"
                        }`}
                    >
                        {t("sub_title")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <Label className="text-sm mb-3 block text-gray-50">
                            {t("select_language")}
                        </Label>

                        <Select
                            value={currentLanguage}
                            onValueChange={(e) => setCurrentLanguage(e)}
                        >
                            <SelectTrigger
                                className="w-full cursor-pointer"
                                dir={isRTL ? "rtl" : "ltr"}
                            >
                                <SelectValue>
                                    <div className="flex items-center space-x-2 uppercase dark:text-white">
                                        <Image
                                            src={selectedLanguage?.flag}
                                            alt={selectedLanguage?.name}
                                            width={25}
                                            height={25}
                                            loading="lazy"
                                        />
                                        <span>{selectedLanguage?.name}</span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem
                                        key={lang.code}
                                        value={lang.code}
                                        className="cursor-pointer"
                                        dir={isRTL ? "rtl" : "ltr"}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={lang.flag}
                                                alt={lang.name}
                                                width={25}
                                                height={25}
                                            />
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
                            className="cursor-pointer"
                        >
                            {t("cancel")}
                        </Button>

                        <Button
                            onClick={() => switchLang(currentLanguage)}
                            className="bg-accent-500 hover:bg-accent-600 dark:text-white cursor-pointer"
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
