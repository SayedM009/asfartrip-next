import RefundPage from "@/app/_components/staticPages/refund/RefundPage";
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
        title: dict.RefundPage.metaTitle,
        description: dict.RefundPage.metaDescription,
        keywords: dict.RefundPage.metaKeywords,
    });
}

function page({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/about-us",
        title: dict.RefundPage?.metaTitle,
        description: dict.RefundPage?.metaDescription,
        keywords: dict.RefundPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="refund-policy"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RefundPage />
        </>
    );
}

export default page;
