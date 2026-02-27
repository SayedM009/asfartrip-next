import Navbar from "@/app/_components/navigation/Navbar";
import HotelDetailsContent from "@/app/_modules/hotels/details/components/organisms/HotelDetailsContent";

// Generate SEO
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import { generatePageMetadata, buildWebPageJsonLd } from "@/app/_libs/seo";
import { DEFAULT_LOCALE } from "@/app/_config/i18n";
import HotelSearch from "@/app/_modules/hotels/search/components/organisms/HotelSearch";
import {
    getHotelDetails,
    getRoomsData,
} from "@/app/_modules/hotels/details/utils/getHotelDetails";

export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const hotel = await getHotelDetails((await params)?.hotelId);

    return generatePageMetadata({
        locale,
        path: "/hotels",
        title: hotel?.data?.Name || "Hotel Details",
        description: hotel?.data?.Description || "",
        keywords: hotel?.data?.Keywords || "",
    });
}

export default async function HotelDetailsPage({ params, searchParams }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const hotelId = (await params)?.hotelId;
    const search = await searchParams;

    // Parse roomDetails from search params
    let roomsConfig = [{ adults: parseInt(search?.adults) || 2 }];
    if (search?.roomDetails) {
        try {
            roomsConfig = JSON.parse(search.roomDetails);
        } catch (e) {
            // fallback to default
        }
    }

    // Fetch hotel details + rooms in parallel
    const [hotel, initialRooms] = await Promise.all([
        getHotelDetails(hotelId),
        getRoomsData(
            hotelId,
            search?.checkIn,
            search?.checkOut,
            search?.nationality,
            roomsConfig
        ),
    ]);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: `/hotels/details/${hotelId}`,
        title: hotel?.data?.Name || "Hotel Details",
        description: hotel?.data?.Description || "",
        keywords: hotel?.data?.Keywords || "",
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
            <div className="pb-20 md:pb-4">
                <HotelDetailsContent
                    hotelId={hotelId}
                    initialHotelDetails={hotel?.data || null}
                    initialRooms={initialRooms?.data || null}
                />
            </div>
        </section>
    );
}
