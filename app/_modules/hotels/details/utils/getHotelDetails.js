import { hotelService } from "@/app/_modules/hotels/services/hotelService";

/**
 * Get hotel details — calls hotelService directly (no HTTP roundtrip)
 */
export async function getHotelDetails(hotelId) {
    try {
        const result = await hotelService.getHotelDetails(
            hotelId,
            `ssr-${hotelId}`
        );
        if (result.status === "Success" && result.response?.HotelDetails) {
            return { success: true, data: result.response.HotelDetails };
        }
        return { success: false, error: "Hotel not found" };
    } catch (err) {
        console.error("[SSR getHotelDetails Error]:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Get rooms availability — calls hotelService directly
 * Returns the full rooms response including SearchPayLoad and HotelRooms with RoomLoad
 */
export async function getRoomsData(
    hotelId,
    checkIn,
    checkOut,
    nationality,
    rooms
) {
    if (!checkIn || !checkOut) return { success: false, data: null };

    try {
        const result = await hotelService.getRoomsAvailability(
            {
                hotel_id: hotelId,
                check_in: checkIn,
                check_out: checkOut,
                nationality: nationality || "AE",
                rooms: rooms || [{ adults: 2 }],
            },
            `ssr-rooms-${hotelId}`
        );

        const roomsData =
            result?.response?.RoomsAvailibility || result?.response || null;
        return { success: true, data: roomsData };
    } catch (err) {
        console.error("[SSR getRoomsData Error]:", err);
        return { success: false, data: null };
    }
}
