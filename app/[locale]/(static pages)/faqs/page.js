import { Footer } from "@/app/_components/Footer";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import FAQPage from "@/app/_components/faq/FAQPage";
import Header from "@/app/_components/Navbar";

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

function page({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);
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
            <Header />
            <FAQPage />
            <Footer />
            <BottomAppBar />
        </>
    );
}

export default page;
