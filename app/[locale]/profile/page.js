import ProfileOnMobile from "@/app/_modules/profile/components/templates/ProfileMobileTemplate";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";

export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/profile",
        title: dict.Profile.metaTitle,
        description: dict.Profile.metaDescription,
        keywords: dict.Profile?.metaKeywords,
    });
}

async function Page({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/profile",
        title: dict.Profile?.metaTitle,
        description: dict.Profile?.metaDescription,
        keywords: dict.Profile?.metaKeywords,
    });

    // Server component - just render the mobile profile
    // The mobile detection is handled by CSS (hidden md:block pattern in other places)
    return (
        <>
            <Script
                id="profile"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProfileOnMobile />
        </>
    );
}

export default Page;
