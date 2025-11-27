"use client";

import { useTranslations } from "next-intl";
import Logo from "../../ui/Logo";
import SocialMedia from "../../SocialMedia";

export default function CompanyInfo() {
    const t = useTranslations("Footer");

    return (
        <div>
            <Logo />

            <p className="text-sm mt-4 mb-4">{t("title")}</p>

            <SocialMedia options={{sizeIcon: 4, align: "start", sizeOnMobile: 6, sizeOnTablet: 6, sizeOnDesktop: 9}}/>
        </div>
    );
}
