"use client";

import useHotelDetails from "../../hooks/useHotelDetails";
import HotelDetailsSkeleton from "./HotelDetailsSkeleton";
import HeroGallery from "./HeroGallery";
import HotelInfo from "../molecules/HotelInfo";
import DetailsPriceDisplay from "../molecules/DetailsPriceDisplay";
import RoomsList from "./RoomsList";
import AmenitiesGrid from "./AmenitiesGrid";
import LocationMap from "./LocationMap";
import BookingSidebar from "./BookingSidebar";
import MobileBookingBar from "./MobileBookingBar";
import MobileHeader from "../molecules/MobileHeader";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
import { useTranslations } from "next-intl";
import TripAdvRating from "../molecules/TripAdvRating";
import Attractions from "../molecules/Attractions";
import Description from "../molecules/Description";
import ContactInfo from "../molecules/ContactInfo";

/**
 * Main hotel details content component
 */
export default function HotelDetailsContent({ hotelId, initialHotelDetails, initialRooms }) {
    const { hotelDetails, rooms, hotelRooms, loading, roomsLoading, error, searchParams, searchPayload } =
        useHotelDetails(hotelId, initialHotelDetails, initialRooms);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const urlSearchParams = useSearchParams();
    const t = useTranslations("Hotels.details");


    // Build results URL with search params
    const resultsUrl = useMemo(() => {
        return `/hotels/results?${urlSearchParams.toString()}`;
    }, [urlSearchParams]);

    // Get min price from rooms
    const minRoomPrice = useMemo(() => {
        if (!hotelRooms || hotelRooms.length === 0) return null;
        return Math.min(...hotelRooms.map((r) => r.RoomPrice?.Price || 0));
    }, [hotelRooms]);

    // Loading state
    if (loading) {
        return <HotelDetailsSkeleton />;
    }

    // Error state
    if (error) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-muted-foreground mt-2">{error}</p>
            </div>
        );
    }

    // No hotel found
    if (!hotelDetails) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Hotel Not Found</h1>
            </div>
        );
    }

    // Parse images
    const images = hotelDetails.Images
        ? Object.values(hotelDetails.Images)
        : [hotelDetails.HotelImage];

    return (
        <section>
            <Link
                href={resultsUrl}
                className="items-center gap-2 text-blue-500 font-bold mb-2 hidden md:flex"
            >
                <span className="rotate-180 flex justify-end ">
                    <ChevronBasedOnLanguage icon="arrow" size="5" />
                </span>
                All properties in {hotelDetails.CityName}
            </Link>

            {/* Hotel Info + Price (Desktop) */}
            <div className="hidden md:flex items-start justify-between">
                <HotelInfo
                    name={hotelDetails.Name}
                    starRating={hotelDetails.StarRating}
                    tripAdvisorRating={hotelDetails.TripAdvisorRating}
                    address={hotelDetails.Address}
                    cityName={hotelDetails.CityName}
                    countryName={hotelDetails.CountryName}
                />
                {/* Price + Select Rooms */}
                {minRoomPrice && (
                    <DetailsPriceDisplay
                        price={minRoomPrice}
                        originalPrice={hotelDetails.PriceBeforeDiscount}
                    />
                )}
            </div>

            {/* Hero Gallery - relative container for mobile header overlay */}
            <div className="relative">
                {/* Mobile Header - positioned over gallery */}
                <div className="md:hidden absolute top-0 left-0 right-0 z-10">
                    <MobileHeader
                        hotelName={hotelDetails.Name}
                        resultsUrl={resultsUrl}
                    />
                </div>
                <HeroGallery images={images} hotelName={hotelDetails.Name} />
            </div>

            {/* Hotel Info (Mobile) */}
            <div className="md:hidden">
                <HotelInfo
                    name={hotelDetails.Name}
                    starRating={hotelDetails.StarRating}
                    address={hotelDetails.Address}
                    cityName={hotelDetails.CityName}
                    countryName={hotelDetails.CountryName}
                />
                <TripAdvRating
                    tripAdvisorRating={hotelDetails.TripAdvisorRating}
                    parentClass="my-6"
                    ratingClass="!px-3  text-lg"
                    imageSize={35}
                    showLabel={true}
                />
            </div>

            {/* Main Content Grid Desktop*/}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 md:mt-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}

                    {/* Amenities */}
                    {hotelDetails.Facilities && (
                        <section id="amenities">
                            <h2 className="text-xl font-bold my-4">
                                Amenities
                            </h2>
                            <AmenitiesGrid
                                facilities={hotelDetails.Facilities}
                            />
                        </section>
                    )}

                    {hotelDetails.Description && (
                        <Description html={hotelDetails.Description} />
                    )}

                    {/* Rooms */}
                    <section id="rooms-section">
                        <h2 className="text-xl font-bold mb-4">
                            {t("select_room")}
                        </h2>
                        <RoomsList
                            hotelRooms={hotelRooms}
                            loading={roomsLoading}
                            selectedRoom={selectedRoom}
                            onSelectRoom={setSelectedRoom}
                            searchParams={searchParams}
                            searchPayload={searchPayload}
                            hotelDetails={hotelDetails}
                        />
                    </section>

                    {/* Location */}
                    <section id="location">
                        <h2 className="text-xl font-bold mb-4">Location</h2>
                        <LocationMap
                            latitude={hotelDetails.Latitude}
                            longitude={hotelDetails.Longitude}
                            hotelName={hotelDetails.Name}
                            address={hotelDetails.Address}
                        />
                    </section>

                    {/* Contact Info */}
                    <ContactInfo
                        email={hotelDetails.Email}
                        phone={hotelDetails.PhoneNumber}
                        fax={hotelDetails.FaxNumber}
                        website={hotelDetails.Website}
                    />
                </div>

                {/* Right Column - Booking Sidebar (Desktop) */}
                <div className="hidden lg:block ltr:border-l rtl:border-r border-border px-8">
                    <TripAdvRating
                        tripAdvisorRating={hotelDetails.TripAdvisorRating}
                        parentClass="mt-2 mb-6"
                        ratingClass="!px-3 !py-1 text-lg"
                        imageSize={35}
                        showLabel={true}
                    />

                    {/* Attractions */}
                    <Attractions data={hotelDetails.Attractions} />
                </div>
            </div>

            {/* Mobile Booking Bar */}
            {/* <MobileBookingBar
                selectedRoom={selectedRoom}
                rooms={rooms}
                hotelId={hotelId}
            /> */}
        </section>
    );
}
