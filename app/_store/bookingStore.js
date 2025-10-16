import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
    persist(
        (set, get) => ({
            // Flight ticket & search info (from ticketStore)
            ticket: {},
            searchInfo: {},
            sessionId: "",
            tempId: "",
            paymentMethod: "Payment Gateway",
            specialRequest: "",
            couponCode: "",
            cart: {},
            selectedInsurance: null,
            insurancePlans: [],

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

            setSearchInfo: (newSearchInfo) => {
                const state = get();

                // Calculate total passengers
                const totalPassengers =
                    (newSearchInfo?.ADT || 1) +
                    (newSearchInfo?.CHD || 0) +
                    (newSearchInfo?.INF || 0);

                // Only reinitialize travelers if the count changed or travelers is empty
                const shouldReinitialize =
                    state.travelers.length === 0 ||
                    state.travelers.length !== totalPassengers;

                if (shouldReinitialize) {
                    const newTravelers = Array.from({
                        length: totalPassengers,
                    }).map((_, index) => {
                        const adtCount = newSearchInfo?.ADT || 1;
                        const chdCount = newSearchInfo?.CHD || 0;

                        let type = "Adult";
                        if (index >= adtCount && index < adtCount + chdCount) {
                            type = "Child";
                        } else if (index >= adtCount + chdCount) {
                            type = "Infant";
                        }

                        // Keep existing traveler data if available
                        const existingTraveler = state.travelers[index];
                        if (
                            existingTraveler &&
                            existingTraveler.travelerType === type
                        ) {
                            return existingTraveler;
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
                    });

                    set({
                        searchInfo: newSearchInfo,
                        travelers: newTravelers,
                    });
                } else {
                    set({ searchInfo: newSearchInfo });
                }
            },

            setSessionId: (newSessionId) =>
                set(() => ({
                    sessionId: newSessionId,
                })),

            setTempId: (newTempId) =>
                set(() => ({
                    tempId: newTempId,
                })),

            setPaymentMethod: (paymentMethod) =>
                set(() => ({
                    paymentMethod: paymentMethod,
                })),

            setSpecialRequest: (request) =>
                set(() => ({
                    specialRequest: request,
                })),

            setCouponCode: (couponCode) =>
                set(() => ({
                    couponCode: couponCode,
                })),

            setCart: (newCart) =>
                set(() => ({
                    cart: newCart,
                })),

            setSelectedInsurance: (insurance) => {
                console.log("Setting selected insurance:", insurance);
                set(() => ({ selectedInsurance: insurance }));
            },

            setInsurancePlans: (plans) => {
                console.log("Setting insurance plans:", plans);
                set(() => ({ insurancePlans: plans || [] }));
            },

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
                const insuranceTotal = get().getInsuranceTotal();
                return basePrice + addOnsTotal + insuranceTotal;
            },

            getTotalPassengers: () => {
                const state = get();
                const searchInfo = state.searchInfo || {};
                return (
                    (searchInfo.ADT || 1) +
                    (searchInfo.CHD || 0) +
                    (searchInfo.INF || 0)
                );
            },

            getInsuranceTotal: () => {
                const state = get();
                if (!state.selectedInsurance?.premium) return 0;
                return (
                    state.selectedInsurance.premium * get().getTotalPassengers()
                );
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
            name: "booking-storage",
            partialize: (state) => ({
                travelers: state.travelers,
                contactInfo: state.contactInfo,
                addOns: state.addOns,
                searchInfo: state.searchInfo,
                selectedInsurance: state.selectedInsurance,
                insurancePlans: state.insurancePlans, // إضافة insurancePlans للحفظ
            }),
        }
    )
);

export default useBookingStore;
