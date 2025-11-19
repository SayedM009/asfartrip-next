"use client";

import CompanyInfo from "./CompanyInfo";
import QuickLinks from "./QuickLinks";
import ServicesLinks from "./ServicesLinks";
import LegalLinks from "./LegalLinks";
import PaymentIcons from "./PaymentIcons";
import { Separator } from "@/components/ui/separator";
// import useIsDevice from "@/app/_hooks/useIsDevice";
import { useTranslations } from "next-intl";

export default function Footer() {
    // const { mobile } = useIsDevice();
    const t = useTranslations("Footer");

    return (
        <footer className="text-muted-foreground hidden md:block border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Top Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    <CompanyInfo />
                    <QuickLinks />
                    <ServicesLinks />
                    <LegalLinks />
                </div>

                <Separator className="mb-8" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()}{" "}
                        {t("copy_right.website")} {t("copy_right.text")}
                    </p>
                    <PaymentIcons />
                </div>
            </div>
        </footer>
    );
}
