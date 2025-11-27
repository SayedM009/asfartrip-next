import ProfileOnMobile from "@/app/_modules/profile/components/templates/ProfileMobileTemplate";
import useIsDevice from "@/app/_hooks/useIsDevice";

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
        path: "/profile",
        title: dict.Profile.metaTitle,
        description: dict.Profile.metaDescription,
        keywords: dict.Profile?.metaKeywords,
    });
}

function Page({ params }) {
    const locale = params?.locale || DEFAULT_LOCALE;
    const dict = getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/profile",
        title: dict.Profile?.metaTitle,
        description: dict.Profile?.metaDescription,
        keywords: dict.Profile?.metaKeywords,
    });
    const { mobile } = useIsDevice();
    if (mobile)
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
    return <div>profile</div>;
}

export default Page;
