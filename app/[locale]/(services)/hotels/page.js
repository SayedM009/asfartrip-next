


// Components
import Navbar from "@/app/_components/navigation/Navbar";
import ServicesNavigation from "@/app/_components/navigation/ServicesNavigation";
import HotelSearch from "@/app/_modules/hotels/search/components/organisms/HotelSearch";
import PromotionalSlider from "@/app/_modules/offers/components/organisms/PromotionalSlider";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import { HotelsSlider } from "@/app/_modules/hotels/components/organisms/HotelsSlider";
import { ContinentHotelsSlider } from "@/app/_modules/hotels/components/organisms/ContinentHotelsSlider";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import { DestinationSlider } from "@/app/_modules/hotels/components/organisms/DestinationSlider";





export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/hotels",
        title: dict.HotelPage.metaTitle,
        description: dict.HotelPage.metaDescription,
        keywords: dict.HotelPage.metaKeywords,
    });
}

async function HotelPage({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/hotels",
        title: dict.HotelPage?.metaTitle,
        description: dict.HotelPage?.metaDescription,
        keywords: dict.HotelPage?.metaKeywords,
    });
    return (
        <>
            <Script
                id="hotels"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <section className="space-y-6 mb-10">
                <ServicesNavigation />
                <HotelSearch />
                <PromotionalSlider />
                <DestinationSlider />
                <HotelsSlider />
                <ContinentHotelsSlider />
            </section>
            <BottomAppBar />
        </>
    );
}

export default HotelPage;

