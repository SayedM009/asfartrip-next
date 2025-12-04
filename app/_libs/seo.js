import {

    DEFAULT_LOCALE,
    HREFLANG_MAP,
    SUPPORTED_LOCALES,
} from "@/app/_config/i18n";

export function getBaseUrl() {
    let base = process.env.WEBSITE_URL ?? "https://www.asfartrip.com";
    if (base.endsWith("/")) base = base.slice(0, -1);
    return base;
}

export function generatePageMetadata({
    locale = DEFAULT_LOCALE,
    path = "/",
    title,
    description,
    image,
    keywords,
}) {
    const baseUrl = getBaseUrl();

    let normalizedPath;
    if (!path || path === "/") {
        normalizedPath = "";
    } else {
        normalizedPath = path.startsWith("/") ? path : `/${path}`;
    }

    const currentUrl = `${baseUrl}/${locale}${normalizedPath}`;

    const languages = {};
    SUPPORTED_LOCALES.forEach((lng) => {
        const hreflang = HREFLANG_MAP[lng] || lng;
        languages[hreflang] = `${baseUrl}/${lng}${normalizedPath}`;
    });

    return {
        title,
        description,
        alternates: {
            canonical: currentUrl,
            languages,
        },
        keywords:
            keywords ||
            "asfartrip.com, flight tickets, hotels, travel insurance, UAE travel, حجوزات طيران, أسفار تريب",
        openGraph: {
            title,
            description,
            url: currentUrl,
            siteName: "asfartrip.com",
            locale: locale === "ar" ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: "index, follow",
    };
}

export function buildWebPageJsonLd({ locale, path = "/", title, description }) {
    const baseUrl = getBaseUrl();
    const normalizedPath =
        !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    const url = `${baseUrl}/${locale}${normalizedPath}`;

    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url,
        inLanguage: locale,
    };
}

export function buildHomeJsonLd({ locale }) {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/${locale}`;

    return [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            url,
            name: "AsfarTrip",
            inLanguage: locale,
            potentialAction: {
                "@type": "SearchAction",
                target: `${url}/flights?query={search_term_string}`,
                "query-input": "required name=search_term_string",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AsfarTrip",
            url: baseUrl,
            logo: `${baseUrl}/Asfartrip-svg.svg`,
            sameAs: [
                "https://www.facebook.com/asfartrip",
                "https://www.instagram.com/asfartrip_official/",
            ],
        },
    ];
}