
// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";

import ProfileOnMobile from "@/app/_modules/profile/components/templates/ProfileMobileTemplate";
import { getIsDevice } from "@/app/_hooks/useIsDevice";




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
    const { mobile } = await getIsDevice();

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/profile",
        title: dict.Profile?.metaTitle,
        description: dict.Profile?.metaDescription,
        keywords: dict.Profile?.metaKeywords,
    });


    return (
        <>
            <Script
                id="profile"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {mobile && <ProfileOnMobile />}
        </>
    );
}

export default Page;
