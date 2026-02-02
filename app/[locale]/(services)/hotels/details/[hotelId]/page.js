import Navbar from "@/app/_components/navigation/Navbar";
import HotelDetailsContent from "@/app/_modules/hotels/details/components/organisms/HotelDetailsContent";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import HotelSearch from "@/app/_modules/hotels/search/components/organisms/HotelSearch";

export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/hotels",
        title: dict.HotelPage?.details?.metaTitle || "Hotel Details",
        description: dict.HotelPage?.details?.metaDescription,
        keywords: dict.HotelPage?.details?.metaKeywords,
    });
}

export default async function HotelDetailsPage({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const hotelId = (await params)?.hotelId;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: `/hotels/details/${hotelId}`,
        title: dict.HotelPage?.details?.metaTitle || "Hotel Details",
        description: dict.HotelPage?.details?.metaDescription,
        keywords: dict.HotelPage?.details?.metaKeywords,
    });

    return (
        <section className="min-h-screen">
            <Script
                id="hotel-details"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Desktop Navbar */}
            <div className="hidden md:block">
                <Navbar />
            </div>

            {/* Desktop: Sticky HotelSearch */}
            <div className="my-4 sticky top-0 z-50 py-2 hidden md:block bg-background">
                <HotelSearch />
            </div>

            {/* Main Content */}
            <div className="container mx-auto pb-20 md:pb-4">
                <HotelDetailsContent hotelId={hotelId} />
            </div>
        </section>
    );
}
