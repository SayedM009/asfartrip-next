import { generatePageMetadata } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import { getDictionary } from "@/app/_libs/getDictionary";
import { buildWebPageJsonLd } from "@/app/_libs/seo";
import Script from "next/script";
import Navbar from "@/app/_components/navigation/Navbar";
import ServicesNavigation from "@/app/_components/navigation/ServicesNavigation";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import { InsuranceSearchForm } from "@/app/_modules/insurance/components/templates";
import PromotionalSlider from "@/app/_modules/offers/components/organisms/PromotionalSlider";
import { FeaturesSection, PlansSection, WhatIsCovered } from "@/app/_modules/insurance/components/organisms";

export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/insurance",
        title: dict.InsurancePage.metaTitle,
        description: dict.InsurancePage.metaDescription,
        keywords: dict.InsurancePage.metaKeywords,
    });
}

async function page({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/insurance",
        title: dict.InsurancePage?.metaTitle,
        description: dict.InsurancePage?.metaDescription,
        keywords: dict.InsurancePage?.metaKeywords,
    });
    return <>
        <Script
            id="insurance"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <section className="space-y-6 mb-10 min-h-screen">
            <ServicesNavigation />
            <InsuranceSearchForm />
            <PromotionalSlider />
            <FeaturesSection />
            <PlansSection />
            <WhatIsCovered />
        </section>
        <BottomAppBar />
    </>
}

export default page
