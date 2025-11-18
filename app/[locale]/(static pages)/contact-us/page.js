import { Footer } from "@/app/_components/Footer";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import ContactUs from "@/app/_components/contact-us/ContactUs";
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
        path: "/about-us",
        title: dict.ContactPage.metaTitle,
        description: dict.ContactPage.metaDescription,
        keywords: dict.ContactPage.metaKeywords,
    });
}

function page({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);
    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/about-us",
        title: dict.ContactPage?.metaTitle,
        description: dict.ContactPage?.metaDescription,
        keywords: dict.ContactPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="contact-us"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <ContactUs />
            <Footer />
            <BottomAppBar />
        </>
    );
}

export default page;
