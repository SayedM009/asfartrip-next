import FAQPage from "@/app/_components/staticPages/faq/FAQPage";

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
        path: "/faqs",
        title: dict.FAQPage.metaTitle,
        description: dict.FAQPage.metaDescription,
        keywords: dict.FAQPage.metaKeywords,
    });
}

async function page({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/faqs",
        title: dict.FAQPage?.metaTitle,
        description: dict.FAQPage?.metaDescription,
        keywords: dict.FAQPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="FAQs"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FAQPage />
        </>
    );
}

export default page;
