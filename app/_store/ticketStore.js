import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
    persist(
        (set, get) => ({
            // Flight ticket & search info
            ticket: {},
            searchInfo: {},

            // Travelers data - array of traveler objects
            travelers: [],

            // Contact information
            contactInfo: {
                bookingForSomeoneElse: false,
                countryCode: "+971",
                bookerName: "",
                email: "",
                phone: "",
            },

            // Add-ons pricing
            addOns: {
                selectedBaggage: null,
                baggagePrice: 0,
                selectedMeal: "none",
                mealPrice: 0,
            },

            // Actions
            setTicket: (newTicket) =>
                set(() => ({
                    ticket: newTicket,
                })),

            setSearchInfo: (newSearchInfo) =>
                set(() => ({
                    searchInfo: newSearchInfo,
                    // Initialize travelers array based on passenger count
                    travelers: Array.from({
                        length:
                            (newSearchInfo?.ADT || 1) +
                            (newSearchInfo?.CHD || 0) +
                            (newSearchInfo?.INF || 0),
                    }).map((_, index) => {
                        const adtCount = newSearchInfo?.ADT || 1;
                        const chdCount = newSearchInfo?.CHD || 0;

                        let type = "Adult";
                        if (index >= adtCount && index < adtCount + chdCount) {
                            type = "Child";
                        } else if (index >= adtCount + chdCount) {
                            type = "Infant";
                        }

                        return {
                            travelerNumber: index + 1,
                            travelerType: type,
                            title: "",
                            firstName: "",
                            lastName: "",
                            dateOfBirth: null,
                            passportNumber: "",
                            passportExpiry: null,
                            nationality: "",
                            isCompleted: false,
                        };
                    }),
                })),

            // Update specific traveler
            updateTraveler: (travelerNumber, data) =>
                set((state) => ({
                    travelers: state.travelers.map((t) =>
                        t.travelerNumber === travelerNumber
                            ? { ...t, ...data }
                            : t
                    ),
                })),

            // Get specific traveler
            getTraveler: (travelerNumber) => {
                const state = get();
                return state.travelers.find(
                    (t) => t.travelerNumber === travelerNumber
                );
            },

            // Update contact info
            updateContactInfo: (data) =>
                set((state) => ({
                    contactInfo: { ...state.contactInfo, ...data },
                })),

            // Update add-ons
            updateBaggage: (selectedBaggage, price) =>
                set((state) => ({
                    addOns: {
                        ...state.addOns,
                        selectedBaggage,
                        baggagePrice: price,
                    },
                })),

            updateMeal: (selectedMeal, price) =>
                set((state) => ({
                    addOns: {
                        ...state.addOns,
                        selectedMeal,
                        mealPrice: price,
                    },
                })),

            // Get total price including add-ons
            getTotalPrice: () => {
                const state = get();
                const basePrice = state.ticket?.TotalPrice || 0;
                const addOnsTotal =
                    state.addOns.baggagePrice + state.addOns.mealPrice;
                return basePrice + addOnsTotal;
            },

            // Get add-ons total
            getAddOnsTotal: () => {
                const state = get();
                return state.addOns.baggagePrice + state.addOns.mealPrice;
            },

            // Validate all travelers
            validateAllTravelers: () => {
                const state = get();
                return state.travelers.every((traveler) => {
                    return !!(
                        traveler.title &&
                        traveler.firstName &&
                        traveler.lastName &&
                        traveler.dateOfBirth &&
                        traveler.passportNumber &&
                        traveler.passportExpiry &&
                        traveler.nationality
                    );
                });
            },

            // Validate contact info
            validateContactInfo: () => {
                const state = get();
                const { contactInfo } = state;
                const isEmailValid =
                    contactInfo.email &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
                const isPhoneValid =
                    contactInfo.phone && contactInfo.phone.trim().length >= 7;
                const isBookerNameValid =
                    !contactInfo.bookingForSomeoneElse ||
                    (contactInfo.bookerName &&
                        contactInfo.bookerName.trim().length > 0);

                return isEmailValid && isPhoneValid && isBookerNameValid;
            },

            // Clear booking data (useful after successful booking or when starting new)
            clearBookingData: () =>
                set(() => ({
                    travelers: [],
                    contactInfo: {
                        bookingForSomeoneElse: false,
                        countryCode: "+971",
                        bookerName: "",
                        email: "",
                        phone: "",
                    },
                    addOns: {
                        selectedBaggage: null,
                        baggagePrice: 0,
                        selectedMeal: "none",
                        mealPrice: 0,
                    },
                })),
        }),
        {
            name: "booking-storage", // unique name for localStorage key
            // You can customize what to persist
            partialize: (state) => ({
                travelers: state.travelers,
                contactInfo: state.contactInfo,
                addOns: state.addOns,
                // Don't persist ticket and searchInfo as they come from previous page
            }),
        }
    )
);

export default useBookingStore;
// import { create } from "zustand";

// const useFlightTicket = create((set) => ({
//     ticket: {},
//     searchInfo: {},
//     setTicket: (newTicket) =>
//         set(() => ({
//             ticket: newTicket,
//         })),
//     setSearchInfo: (newSearchInfo) =>
//         set(() => ({ searchInfo: newSearchInfo })),
// }));

// export default useFlightTicket;
