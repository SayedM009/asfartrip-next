import Header from "@/app/_components/Navbar";
import About from "@/app/_components/about/About";
import { Footer } from "@/app/_components/Footer";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";

export async function generateMetadata({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/about-us",
        title: dict.About.metaTitle,
        description: dict.About.metaDescription,
        keywords: dict.About.metaKeywords,
    });
}

export default function AboutPage({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/about-us",
        title: dict.About?.metaTitle,
        description: dict.About?.metaDescription,
        keywords: dict.About?.metaKeywords,
    });
    return (
        <>
            <Script
                id="about-us"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <About />
            <Footer />
            <BottomAppBar />
        </>
    );
}
