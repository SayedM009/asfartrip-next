import CancellationPage from "@/app/_components/staticPages/cancellationPage/CancellationPage";
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
        title: dict.CancellationPage.metaTitle,
        description: dict.CancellationPage.metaDescription,
        keywords: dict.CancellationPage.metaKeywords,
    });
}

async function page({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/about-us",
        title: dict.CancellationPage?.metaTitle,
        description: dict.CancellationPage?.metaDescription,
        keywords: dict.CancellationPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="cancellation-policy"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CancellationPage />
        </>
    );
}

export default page;
