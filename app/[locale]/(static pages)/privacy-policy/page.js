import PrivacyPage from "@/app/_components/staticPages/privacy/PrivacyPage";
// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";

export async function generateMetadata({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/about-us",
        title: dict.PrivacyPage.metaTitle,
        description: dict.PrivacyPage.metaDescription,
        keywords: dict.PrivacyPage.metaKeywords,
    });
}

async function page({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/about-us",
        title: dict.PrivacyPage?.metaTitle,
        description: dict.PrivacyPage?.metaDescription,
        keywords: dict.PrivacyPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="terms-and-condition"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PrivacyPage />
        </>
    );
}

export default page;
