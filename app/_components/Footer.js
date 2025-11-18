import React from "react";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Music2 } from "lucide-react";
import useIsDevice from "../_hooks/useIsDevice";
import Logo from "./ui/Logo";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const quick_links = [
    {
        title: "about_us",
        path: "/about-us",
    },
    {
        title: "contact_us",
        path: "/contact-us",
    },
    {
        title: "faqs",
        path: "/faqs",
    },
];

const services = [
    {
        title: "flight",
        path: "/flights",
    },
    {
        title: "hotel",
        path: "/hotel",
    },
    {
        title: "car",
        path: "/car",
    },
    {
        title: "insurance",
        path: "/insurance",
    },
];

const important_links = [
    { title: "terms_conditions", path: "/terms-and-conditions" },
    { title: "privacy_policy", path: "/privacy-policy" },
    { title: "cancellation_policy", path: "/cancellation-policy" },
    { title: "refund_policy", path: "/refund-policy" },
];

export function Footer() {
    const { mobile } = useIsDevice();
    const t = useTranslations("Footer");
    const p = useTranslations("Pages");
    if (mobile) return null;
    return (
        <footer className="text-muted-foreground hidden md:block border-t-1 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Logo />
                        </div>
                        <p className="text-sm mb-4">{t("title")}</p>
                        <div className="flex space-x-3">
                            <Link
                                className="p-2 hover:cursor-pointer "
                                title={t("social_icons.face_book")}
                                href="https://www.facebook.com/Asfartrip"
                                target="_blank"
                            >
                                <Facebook className="size-5 hover:text-black dark:hover:text-white" />
                            </Link>
                            <Link
                                className="p-2 hover:cursor-pointer"
                                title={t("social_icons.instagram")}
                                href="https://www.instagram.com/asfartrip_official/"
                                target="_blank"
                            >
                                <Instagram className="size-5 hover:text-black dark:hover:text-white" />
                            </Link>
                            <Link
                                className="p-2 hover:cursor-pointer"
                                title={t("social_icons.x")}
                                href="https://www.tiktok.com/@asfartrip"
                                target="_blank"
                            >
                                <Music2 className="size-5 hover:text-black dark:hover:text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-foreground mb-4 font-semibold text-lg">
                            {t("company")}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {quick_links.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        href={link.path}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {p(`${link.title}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-foreground mb-4 font-semibold text-lg">
                            {t("services.title")}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {services.map((Service) => (
                                <li key={Service.path}>
                                    <Link
                                        href={Service.path}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {t(`services.${Service.title}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-foreground mb-4 font-semibold text-lg">
                            {t("legal.title")}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {important_links.map((link) => (
                                <li key={link}>
                                    <Link
                                        href={link.path}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {p(`${link.title}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    {/* <div>
                        <h3 className="text-foreground mb-4 font-semibold">
                            {t("stay_updated.title")}
                        </h3>
                        <p className="text-sm mb-4">
                            {t("stay_updated.sub_title")}
                        </p>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                <Input
                                    placeholder={t("stay_updated.place_holder")}
                                    className="pl-10 bg-background"
                                />
                            </div>
                            <Button size="sm" className="cursor-pointer px-5">
                                {t("stay_updated.subscribe")}
                            </Button>
                        </div>
                    </div> */}
                </div>

                <Separator className="mb-8" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    <div className="mb-4 md:mb-0">
                        <p>
                            &copy; {new Date().getFullYear().toString()}{" "}
                            {t("copy_right.website")} {t("copy_right.text")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/currencies/visa.svg"
                            alt="card payment with visa"
                            width={30}
                            height={30}
                            quality={100}
                        />
                        <Image
                            src="/currencies/mastercard.svg"
                            alt="card payment with mastercard"
                            width={30}
                            height={30}
                            quality={100}
                        />
                        <Image
                            src="/currencies/maestro.svg"
                            alt="card payment with maestro"
                            width={30}
                            height={30}
                            quality={100}
                        />
                        <Image
                            src="/currencies/mada.svg"
                            alt="card payment with mada"
                            width={40}
                            height={40}
                            quality={100}
                        />
                        <Image
                            src="/currencies/jcb.svg"
                            alt="card payment with jcb"
                            width={25}
                            height={25}
                            quality={100}
                        />
                        <Image
                            src="/currencies/amex.svg"
                            alt="card payment with american-express"
                            width={30}
                            height={30}
                            quality={100}
                        />
                        <Image
                            src="/currencies/tabby.svg"
                            alt="payment with tabby"
                            width={30}
                            height={30}
                            quality={100}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
