import { create } from "zustand";
import { persist } from "zustand/middleware";

const useHotelBookingStore = create(
    persist(
        (set, get) => ({
            // ================= Hotel & Room Data =================
            hotelInfo: {},        // name, image, rating, address
            roomInfo: {},         // room name, mealType, cancellationPolicy, price, currency
            rateInfo: {},         // full RateInfo API response

            // ================= Booking IDs =================
            cartId: "",           // from RateInfo → used in BookHotel
            referenceNo: "",      // from RateInfo → ReferenceNo
            bookingReference: "", // from BookHotel → BookingReference
            bookingPNR: "",       // from BookHotel → BookingPNR

            // ================= Search Context =================
            searchParams: {},     // checkIn, checkOut, nights, nationality, roomsConfig
            encodedSearch: "",    // SearchPayLoad for API calls
            roomLoad: "",         // RoomLoad for API calls

            // ================= Guests =================
            leadGuest: {
                salutation: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneCode: "+971",
                phoneNumber: "",
                address: "",
                countryCode: "AE",
            },
            otherGuests: [],      // [{salutation, firstName, lastName}]

            // ================= Booking Meta =================
            userId: 0,
            userType: "",
            paymentMethod: "Payment Gateway",
            searchURL: "",        // return URL to hotel details
            gateway: null,

            // ================= Setters =================
            setHotelInfo: (info) => set({ hotelInfo: info }),
            setRoomInfo: (info) => set({ roomInfo: info }),
            setRateInfo: (data) => set({ rateInfo: data }),
            setCartId: (id) => set({ cartId: id }),
            setReferenceNo: (ref) => set({ referenceNo: ref }),
            setBookingReference: (ref) => set({ bookingReference: ref }),
            setBookingPNR: (pnr) => set({ bookingPNR: pnr }),
            setSearchParams: (params) => set({ searchParams: params }),
            setEncodedSearch: (val) => set({ encodedSearch: val }),
            setRoomLoad: (val) => set({ roomLoad: val }),
            setSearchURL: (url) => set({ searchURL: url }),
            setUserId: (id) => set({ userId: id || 0 }),
            setUserType: (type) => set({ userType: type || "" }),
            setPaymentMethod: (method) => set({ paymentMethod: method }),
            setGateway: (data) => set({ gateway: { ifrurl: data || null } }),

            // ================= Lead Guest =================
            updateLeadGuest: (data) =>
                set((state) => ({
                    leadGuest: { ...state.leadGuest, ...data },
                })),

            // ================= Other Guests =================
            initOtherGuests: (roomsConfig) => {
                const guests = [];
                let totalAdults = 0;
                let totalChildren = 0;

                (roomsConfig || []).forEach((room) => {
                    totalAdults += room.adults || 0;
                    totalChildren += (room.children || room.childs?.length || 0);
                });

                // Exclude lead guest (1 adult)
                const otherAdults = Math.max(0, totalAdults - 1);
                const otherChildCount = totalChildren;

                for (let i = 0; i < otherAdults; i++) {
                    guests.push({ type: "adult", salutation: "", firstName: "", lastName: "" });
                }
                for (let i = 0; i < otherChildCount; i++) {
                    guests.push({ type: "child", salutation: "", firstName: "", lastName: "" });
                }

                set({ otherGuests: guests });
            },

            updateOtherGuest: (index, data) =>
                set((state) => ({
                    otherGuests: state.otherGuests.map((g, i) =>
                        i === index ? { ...g, ...data } : g
                    ),
                })),

            // ================= Computed =================
            getTotalPrice: () => {
                const { rateInfo } = get();
                return rateInfo?.RateInfo?.Pricing?.RoomPrice?.Price || 0;
            },

            getCurrency: () => {
                const { rateInfo } = get();
                return rateInfo?.RateInfo?.Pricing?.RoomPrice?.Currency || "AED";
            },

            getTotalGuests: () => {
                return 1 + get().otherGuests.length; // lead + others
            },

            // ================= Validation =================
            validateLeadGuest: () => {
                const { leadGuest } = get();
                return (
                    leadGuest.salutation &&
                    leadGuest.firstName?.trim() &&
                    leadGuest.lastName?.trim() &&
                    leadGuest.email?.trim() &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadGuest.email) &&
                    leadGuest.phoneNumber?.trim()?.length >= 7 &&
                    leadGuest.address?.trim() &&
                    leadGuest.countryCode?.trim()
                );
            },

            validateOtherGuests: () => {
                const { otherGuests } = get();
                if (otherGuests.length === 0) return true;
                return otherGuests.every(
                    (g) => g.salutation && g.firstName?.trim() && g.lastName?.trim()
                );
            },

            validateAllGuests: () => {
                return get().validateLeadGuest() && get().validateOtherGuests();
            },

            // ================= Final Payload for BookHotel =================
            getFinalPayload: () => {
                const { leadGuest, otherGuests, cartId } = get();

                // Build guests JSON for other guests
                const adults = otherGuests
                    .filter((g) => g.type === "adult")
                    .map((g) => ({
                        salutation: g.salutation,
                        first_name: g.firstName,
                        last_name: g.lastName,
                    }));

                const childs = otherGuests
                    .filter((g) => g.type === "child")
                    .map((g) => ({
                        salutation: g.salutation,
                        first_name: g.firstName,
                        last_name: g.lastName,
                    }));

                const payload = {
                    cart_id: cartId,
                    salutation: leadGuest.salutation,
                    first_name: leadGuest.firstName,
                    last_name: leadGuest.lastName,
                    email: leadGuest.email,
                    phone_code: leadGuest.phoneCode || "+971",
                    phone_number: leadGuest.phoneNumber,
                    address: leadGuest.address,
                    country_code: leadGuest.countryCode,
                };

                // Only include guests if there are other guests
                if (adults.length > 0 || childs.length > 0) {
                    payload.guests = JSON.stringify({ adults, childs });
                }

                return payload;
            },

            // ================= Initialize from room selection =================
            initializeBooking: ({
                hotelInfo,
                roomInfo,
                searchParams,
                encodedSearch,
                roomLoad,
                searchURL,
            }) => {
                set({
                    hotelInfo,
                    roomInfo,
                    searchParams,
                    encodedSearch,
                    roomLoad,
                    searchURL,
                    // Reset previous booking data
                    cartId: "",
                    referenceNo: "",
                    bookingReference: "",
                    bookingPNR: "",
                    rateInfo: {},
                    gateway: null,
                    leadGuest: {
                        salutation: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phoneCode: "+971",
                        phoneNumber: "",
                        address: "",
                        countryCode: "AE",
                    },
                    otherGuests: [],
                });
            },

            // ================= Clear =================
            clearBookingData: () => {
                set({
                    hotelInfo: {},
                    roomInfo: {},
                    rateInfo: {},
                    cartId: "",
                    referenceNo: "",
                    bookingReference: "",
                    bookingPNR: "",
                    searchParams: {},
                    encodedSearch: "",
                    roomLoad: "",
                    leadGuest: {
                        salutation: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phoneCode: "+971",
                        phoneNumber: "",
                        address: "",
                        countryCode: "AE",
                    },
                    otherGuests: [],
                    userId: 0,
                    userType: "",
                    searchURL: "",
                    gateway: null,
                });
            },
        }),
        {
            name: "hotel-booking-storage",
            partialize: (state) => ({
                hotelInfo: state.hotelInfo,
                roomInfo: state.roomInfo,
                rateInfo: state.rateInfo,
                cartId: state.cartId,
                referenceNo: state.referenceNo,
                bookingReference: state.bookingReference,
                bookingPNR: state.bookingPNR,
                searchParams: state.searchParams,
                encodedSearch: state.encodedSearch,
                roomLoad: state.roomLoad,
                leadGuest: state.leadGuest,
                otherGuests: state.otherGuests,
                userId: state.userId,
                userType: state.userType,
                searchURL: state.searchURL,
                gateway: state.gateway,
            }),
        }
    )
);

export default useHotelBookingStore;
