"use client";

import CompanyInfo from "./CompanyInfo";
import QuickLinks from "./QuickLinks";
import ServicesLinks from "./ServicesLinks";
import LegalLinks from "./LegalLinks";
import CardsAccepted from "./CardsAccepted";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
// import { WebsiteConfigContext } from "@/app/_modules/config";
import { use } from "react";

export default function Footer() {
    const t = useTranslations("Footer");

    // const { website } = use(WebsiteConfigContext);

    return (
        <footer className="text-muted-foreground hidden md:block border-t">
            <div className=" py-12">
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
                    {/* <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} {website?.name}{" "}
                        {t("copy_right.text")}
                    </p> */}
                    <CardsAccepted />
                </div>
            </div>
        </footer>
    );
}
