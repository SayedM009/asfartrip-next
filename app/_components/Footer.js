import React from "react";
import { Separator } from "@/components/ui/separator";
import {
    Plane,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useIsDevice from "../_hooks/useIsDevice";
import Logo from "./ui/Logo";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const quick_links = [
    {
        title: "about_us",
        path: "/about",
    },
    {
        title: "contact_us",
        path: "/contact",
    },
    {
        title: "faqs",
        path: "/faqs",
    },
    {
        title: "blog",
        path: "/blog",
    },
];

const services = [
    {
        title: "flight",
        path: "/flight",
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
    { title: "privacy_policy", path: "/privacy" },
    { title: "terms_conditions", path: "/terms" },
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
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title={t("social_icons.face_book")}
                            >
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title={t("social_icons.x")}
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title={t("social_icons.instagram")}
                            >
                                <Instagram className="h-4 w-4" />
                            </Button>
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 relative"
                                title={t("social_icons.tik_tok")}
                            >
                                <Image
                                    src="/icons/tiktok.png"
                                    alt="tiktok"
                                    width={16}
                                    height={8}
                                />
                            </Button> */}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-foreground mb-4 font-semibold">
                            {t("quick_links")}
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
                        <h3 className="text-foreground mb-4 font-semibold">
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

                    {/* Newsletter */}
                    <div>
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
                    </div>
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
                    <div className="flex space-x-6">
                        {important_links.map((link) => (
                            <Link
                                href={link.path}
                                key={link.path}
                                className="hover:text-foreground transition-colors"
                            >
                                {p(`${link.title}`)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
