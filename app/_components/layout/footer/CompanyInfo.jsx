"use client";

import { Facebook, Instagram, Music2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Logo from "../../ui/Logo";

export default function CompanyInfo() {
    const t = useTranslations("Footer");

    return (
        <div>
            <Logo />

            <p className="text-sm mt-4 mb-4">{t("title")}</p>

            <div className="flex space-x-3">
                <Link
                    href="https://www.facebook.com/Asfartrip"
                    target="_blank"
                    title="Facebook"
                >
                    <Facebook className="size-5 hover:text-black dark:hover:text-white" />
                </Link>
                <Link
                    href="https://www.instagram.com/asfartrip_official/"
                    target="_blank"
                    title="Instagram"
                >
                    <Instagram className="size-5 hover:text-black dark:hover:text-white" />
                </Link>
                <Link
                    href="https://www.tiktok.com/@asfartrip"
                    target="_blank"
                    title="TikTok"
                >
                    <Music2 className="size-5 hover:text-black dark:hover:text-white" />
                </Link>
            </div>
        </div>
    );
}
