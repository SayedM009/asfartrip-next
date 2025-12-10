
// Sliders
import { DestinationSlider } from "../_components/sliders/DestinationSlider";
import FlightsSlider from "@/app/_modules/flight/presentation/components/organism/FlightsSlider";
import { HotelsSlider } from "../_components/sliders/HotelsSlider";

// Components
import Navbar, { WegoMobileNavbar } from "@/app/_components/layout/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import { FlightSearchWrapper } from "../_modules/flight/search";
import BottomAppBar from "../_components/layout/bottomAppBar/BottomAppBar";
import PromotionalSlider from "../_modules/offers/components/organisms/PromotionalSlider";
import Footer from "../_components/layout/footer/Footer";

// Generate SEO
import Script from "next/script";
import { DEFAULT_LOCALE } from "../_config/i18n";
import { getDictionary } from "../_libs/getDictionary";
import { buildHomeJsonLd, generatePageMetadata } from "../_libs/seo";
import { FlightSearchFormDesktop } from "../_modules/flight/search/components/desktop/FlightSearchFromDesktop";
import WegoServicesNavigation from "../_components/WegoServicesNavigation";


export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const locale = resolvedParams?.locale || DEFAULT_LOCALE;

    try {
        const dict = await getDictionary(locale);

        return generatePageMetadata({
            locale,
            path: "/",
            title: dict.Homepage?.metaTitle || "AsfarTrip - Travel Booking",
            description: dict.Homepage?.metaDescription || "Book flights, hotels and more",
            keywords: dict.Homepage?.metaKeywords,
        });
    } catch (error) {
        console.error("Error generating metadata:", error);

        // Fallback metadata
        return generatePageMetadata({
            locale,
            path: "/",
            title: "AsfarTrip - Travel Booking",
            description: "Book flights, hotels and more",
        });
    }
}

export default async function HomePage({ params }) {
    const { locale } = await params;
    const jsonLd = buildHomeJsonLd({ locale: locale || DEFAULT_LOCALE });

    return (
        <>

            <div className="relative md:hidden mb-5">
                <div className="w-full h-[20vh] bg-gradient-to-br from-[#031627] via-[#041f35] to-[#05203c] [clip-path:ellipse(85%_100%_at_50%_0%)] px-3 pt-3 animate-gradient-normal">
                    <WegoMobileNavbar />
                </div>
                <div className="absolute z-50 left-1/2 -translate-x-1/2 -bottom-[40px]  flex justify-between">
                    <WegoServicesNavigation />
                </div>
            </div>

            <section className="container-custom">
                <Script
                    id="home-jsonld"
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <section className="space-y-6 mb-10">
                    <div className="hidden md:block">
                        <Navbar />
                    </div>
                    {/* <ServicesNavigation />
                    <FlightSearchWrapper /> */}
                    <div className="hidden md:block">
                        <FlightSearchFormDesktop />
                    </div>
                    <PromotionalSlider />
                    <FlightsSlider />
                    <DestinationSlider />
                    <HotelsSlider />
                </section>
                <Footer />

                <BottomAppBar />
                {/* Testing the SEO */}
                <h2 className="visually-hidden">{locale == "ar" ? "احجز أرخص رحلات الطيران والفنادق وعروض السفر حول العالم مع أسفار تريب" : "Book Cheap Flights, Hotels, and Travel Deals Worldwide with AsfarhiddenTrip"}</h2>
                <h3 className="visually-hidden">{locale == "ar" ? "قارن أسعار تذاكر الطيران والفنادق وباقات العطلات بسهولة" : "Compare Airfares, Hotel Prices, and Holiday Packages Easily"}</h3>
                <p className="visually-hidden">{locale == "ar" ? "تم إنشاء هذا الموقع بواسطة فريق تطوير أسفار تريب" : "Powered by Asfar Travel Tech Team"}</p>
                <p className="visually-hidden">{locale == "ar" ? "توفر لك أسفار تريب أفضل عروض السفر، من رحلات طيران منخفضة التكلفة وفنادق مميزة إلى تأمين السفر وباقات العطلات حول العالم. استمتع بحجوزات فورية، ودفع آمن، وعروض حصرية، ودعم عملاء على مدار الساعة. منصتنا تساعدك على مقارنة الأسعار واختيار الوجهة المناسبة بكل سهولة وثقة." : "AsfarTrip helps travelers find affordable flights, hotel deals, travel insurance, and holiday packages around the world. Enjoy instant booking, secure payments, exclusive travel offers, and 24/7 customer support. Our platform makes it easy to compare prices, explore destinations, and plan your perfect trip with confidence and convenience."}</p>
            </section>
        </>

    );
}
