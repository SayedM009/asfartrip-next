import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
    persist(
        (set, get) => ({
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
            travelers: [],
            contactInfo: {
                bookingForSomeoneElse: false,
                countryCode: "+971",
                bookerName: "",
                email: "",
                phone: "",
            },
            addOns: {
                selectedBaggage: {
                    outbound: [],
                    inbound: [],
                },
                baggagePrice: 0,
                selectedMeal: "none",
                mealPrice: 0,
            },

            userId: 0,
            bookingReference: "",
            gateway: null,
            isDataModified: false,
            searchURL: "",
            baggageData: {
                outward: null,
                return: null,
            },

            setBaggageData: (newData) =>
                set((state) => ({
                    baggageData: {
                        ...state.baggageData,
                        ...newData,
                    },
                })),
            setSearchURL: (URL) => set({ searchURL: URL }),
            setDataModified: (value) => set({ isDataModified: value }),
            setTicket: (newTicket) => set({ ticket: newTicket }),
            setSearchInfo: (newSearchInfo) => {
                const totalPassengers =
                    (newSearchInfo?.ADT || 1) +
                    (newSearchInfo?.CHD || 0) +
                    (newSearchInfo?.INF || 0);
                const shouldReinitialize =
                    get().travelers.length !== totalPassengers;

                if (shouldReinitialize) {
                    const newTravelers = Array.from({
                        length: totalPassengers,
                    }).map((_, index) => {
                        const adtCount = newSearchInfo?.ADT || 1;
                        const chdCount = newSearchInfo?.CHD || 0;
                        let type = "Adult";
                        if (index >= adtCount && index < adtCount + chdCount)
                            type = "Child";
                        else if (index >= adtCount + chdCount) type = "Infant";
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
                    set({ searchInfo: newSearchInfo, travelers: newTravelers });
                } else {
                    set({ searchInfo: newSearchInfo });
                }
            },
            setSessionId: (newSessionId) => set({ sessionId: newSessionId }),
            setTempId: (newTempId) => set({ tempId: newTempId }),
            setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
            setSpecialRequest: (request) => set({ specialRequest: request }),
            setCouponCode: (couponCode) => set({ couponCode }),
            setCart: (newCart) => set({ cart: newCart }),
            setSelectedInsurance: (insurance) =>
                set({ selectedInsurance: insurance, isDataModified: true }),

            setInsurancePlans: (plans) => set({ insurancePlans: plans || [] }),
            updateTraveler: (travelerNumber, data) =>
                set((state) => ({
                    travelers: state.travelers.map((t) =>
                        t.travelerNumber === travelerNumber
                            ? {
                                  ...t,
                                  ...data,
                                  dateOfBirth:
                                      data.dateOfBirth !== undefined
                                          ? data.dateOfBirth
                                              ? typeof data.dateOfBirth ===
                                                "string"
                                                  ? new Date(data.dateOfBirth)
                                                  : data.dateOfBirth
                                              : t.dateOfBirth
                                          : t.dateOfBirth,
                                  passportExpiry:
                                      data.passportExpiry !== undefined
                                          ? data.passportExpiry
                                              ? typeof data.passportExpiry ===
                                                "string"
                                                  ? new Date(
                                                        data.passportExpiry
                                                    )
                                                  : data.passportExpiry
                                              : t.passportExpiry
                                          : t.passportExpiry,
                              }
                            : t
                    ),
                    isDataModified: true,
                })),
            getTraveler: (travelerNumber) =>
                get().travelers.find(
                    (t) => t.travelerNumber === travelerNumber
                ),
            updateContactInfo: (data) =>
                set((state) => ({
                    contactInfo: { ...state.contactInfo, ...data },
                    isDataModified: true,
                })),
            updateBaggage: (selectedBaggage, totalPrice) =>
                set((state) => ({
                    addOns: {
                        ...state.addOns,
                        selectedBaggage: selectedBaggage,
                        baggagePrice: totalPrice,
                    },
                    isDataModified: true,
                })),

            updateMeal: (selectedMeal, price) =>
                set((state) => ({
                    addOns: { ...state.addOns, selectedMeal, mealPrice: price },
                    isDataModified: true,
                })),
            getTotalPrice: () => {
                const state = get();
                const basePrice = state.ticket?.TotalPrice || 0;
                const addOnsTotal =
                    state.addOns.baggagePrice + state.addOns.mealPrice;
                const insuranceTotal =
                    state.selectedInsurance?.premium *
                        state.getTotalPassengers() || 0;
                return basePrice + addOnsTotal + insuranceTotal;
            },
            getTotalPassengers: () => {
                const { searchInfo } = get();
                return (
                    (searchInfo.ADT || 1) +
                    (searchInfo.CHD || 0) +
                    (searchInfo.INF || 0)
                );
            },
            getInsuranceTotal: () =>
                get().selectedInsurance?.premium * get().getTotalPassengers() ||
                0,
            getAddOnsTotal: () =>
                get().addOns.baggagePrice + get().addOns.mealPrice,

            validateAllTravelers: () =>
                get().travelers.every(
                    (t) =>
                        t.title &&
                        t.firstName &&
                        t.lastName &&
                        t.dateOfBirth &&
                        t.passportNumber &&
                        t.passportExpiry &&
                        t.nationality
                ),
            validateContactInfo: () => {
                const { contactInfo } = get();
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
            setUserId: (id) => set({ userId: id || 0 }),
            setBookingData: (data) =>
                set({
                    bookingReference: data.booking_reference || "",
                    gateway: data.gateway || null,
                }),
            getFinalPayload: () => {
                const state = get();
                const {
                    travelers,
                    contactInfo,
                    ticket,
                    addOns,
                    selectedInsurance,
                    sessionId,
                    tempId,
                    userId,
                } = state;

                const totalPrice = state.getTotalPrice(); // يحسب basePrice + addOnsTotal + insuranceTotal

                const passengers = travelers.map((t) => {
                    let dob = "";
                    if (t.dateOfBirth) {
                        if (
                            t.dateOfBirth instanceof Date &&
                            !isNaN(t.dateOfBirth)
                        ) {
                            dob = t.dateOfBirth.toISOString().split("T")[0];
                        } else if (typeof t.dateOfBirth === "string") {
                            const parsedDate = new Date(t.dateOfBirth);
                            if (!isNaN(parsedDate)) {
                                dob = parsedDate.toISOString().split("T")[0];
                            }
                        }
                    }

                    let expiry = "";
                    if (t.passportExpiry) {
                        if (
                            t.passportExpiry instanceof Date &&
                            !isNaN(t.passportExpiry)
                        ) {
                            expiry = t.passportExpiry
                                .toISOString()
                                .split("T")[0];
                        } else if (typeof t.passportExpiry === "string") {
                            const parsedDate = new Date(t.passportExpiry);
                            if (!isNaN(parsedDate)) {
                                expiry = parsedDate.toISOString().split("T")[0];
                            }
                        }
                    }

                    return {
                        type: t.travelerType.toLowerCase(),
                        title: t.title || "",
                        firstName: t.firstName || "",
                        lastName: t.lastName || "",
                        passportNumber: t.passportNumber || "",
                        nationality: t.nationality || "",
                        dob,
                        expiry,
                    };
                });

                const primaryPassenger =
                    passengers.find((p) => p.type === "adult") || passengers[0];

                const transformedData = {
                    housenum: "786",
                    zip: "20772",
                    city: "Dubai",
                    country_code: contactInfo.countryCode || "+971",
                    mobile: contactInfo.phone || "",
                    email: contactInfo.email || "",
                    street_address: "Al Garhoud",
                    country: "AE",
                    total: btoa(String(totalPrice || "0")), // استخدم totalPrice بدلاً من ticket.TotalPrice
                    tripdate:
                        new Date()
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-") || "",
                    cart_id: tempId || "",
                    cid: btoa(JSON.stringify(["FLIGHT", tempId || ""])),
                };

                const groups = passengers.reduce(
                    (acc, p, index) => {
                        if (index === 0 && p === primaryPassenger) {
                            transformedData[`selTitle${tempId}`] = p.title;
                            transformedData[`first_name${tempId}`] =
                                p.firstName.toUpperCase();
                            transformedData[`last_name${tempId}`] =
                                p.lastName.toUpperCase();
                            transformedData[`passport_no${tempId}`] =
                                p.passportNumber;
                            transformedData[`issued_country${tempId}`] =
                                p.nationality.substring(0, 2).toUpperCase();
                            transformedData[`selGender${tempId}`] =
                                p.title === "Mr" ? "Male" : "Female";
                            const [dobYear, dobMonth, dobDay] = p.dob
                                ? p.dob.split("-")
                                : ["", "", ""];
                            transformedData[`txtdob${tempId}`] = p.dob
                                ? `${dobDay}/${dobMonth}/${dobYear}`
                                : "";
                            const [expYear, expMonth, expDay] = p.expiry
                                ? p.expiry.split("-")
                                : ["", "", ""];
                            transformedData[`txtped${tempId}`] = p.expiry
                                ? `${expDay}/${expMonth}/${expYear}`
                                : "";
                        } else {
                            const key = `${p.type}s${index}`;
                            acc[`pselTitle${tempId}`] = {
                                ...acc[`pselTitle${tempId}`],
                                [key]: p.title,
                            };
                            acc[`pfirst_name${tempId}`] = {
                                ...acc[`pfirst_name${tempId}`],
                                [key]: p.firstName.toUpperCase(),
                            };
                            acc[`plast_name${tempId}`] = {
                                ...acc[`plast_name${tempId}`],
                                [key]: p.lastName.toUpperCase(),
                            };
                            acc[`ppassport_no${tempId}`] = {
                                ...acc[`ppassport_no${tempId}`],
                                [key]: p.passportNumber,
                            };
                            acc[`pissued_country${tempId}`] = {
                                ...acc[`pissued_country${tempId}`],
                                [key]: p.nationality
                                    .substring(0, 2)
                                    .toUpperCase(),
                            };
                            acc[`pselGender${tempId}`] = {
                                ...acc[`pselGender${tempId}`],
                                [key]: p.title === "Mr" ? "Male" : "Female",
                            };
                            const [dobYear, dobMonth, dobDay] = p.dob
                                ? p.dob.split("-")
                                : ["", "", ""];
                            acc[`ptxtdob${tempId}`] = {
                                ...acc[`ptxtdob${tempId}`],
                                [key]: p.dob
                                    ? `${dobDay}/${dobMonth}/${dobYear}`
                                    : "",
                            };
                            const [expYear, expMonth, expDay] = p.expiry
                                ? p.expiry.split("-")
                                : ["", "", ""];
                            acc[`ptxtped${tempId}`] = {
                                ...acc[`ptxtped${tempId}`],
                                [key]: p.expiry
                                    ? `${expDay}/${expMonth}/${expYear}`
                                    : "",
                            };
                        }
                        return acc;
                    },
                    {
                        [`pselTitle${tempId}`]: {},
                        [`pfirst_name${tempId}`]: {},
                        [`plast_name${tempId}`]: {},
                        [`ppassport_no${tempId}`]: {},
                        [`pissued_country${tempId}`]: {},
                        [`ptxtdob${tempId}`]: {},
                        [`ptxtped${tempId}`]: {},
                        [`pselGender${tempId}`]: {},
                    }
                );

                Object.assign(transformedData, groups);

                let GUEST_FIRSTNAME = "";
                let GUEST_LASTNAME = "";
                let leadpax = "";
                if (contactInfo.bookerName && contactInfo.bookerName.trim()) {
                    const names = contactInfo.bookerName
                        .trim()
                        .toUpperCase()
                        .split(" ");
                    GUEST_FIRSTNAME = names[0] || "";
                    GUEST_LASTNAME = names.slice(1).join(" ") || "";
                    leadpax = contactInfo.bookerName.toUpperCase();
                } else if (primaryPassenger) {
                    GUEST_FIRSTNAME =
                        primaryPassenger.firstName.toUpperCase() || "";
                    GUEST_LASTNAME =
                        primaryPassenger.lastName.toUpperCase() || "";
                    leadpax = `${GUEST_FIRSTNAME} ${GUEST_LASTNAME}`;
                }

                return {
                    TravelerDetails: JSON.stringify(transformedData),
                    GUEST_FIRSTNAME,
                    GUEST_LASTNAME,
                    GUEST_EMAIL: contactInfo.email || "admin@asfartrip.com",
                    GUEST_PHONE: contactInfo.phone || "97143409933",
                    leadpax,
                    session_id: sessionId,
                    temp_id: tempId,
                    cid: tempId,
                    transaction_status: "PROCESS",
                    payment_method: "Payment Gateway",
                    booking_status: "PROCESS",
                    currency: "AED",
                    rate: 1,
                    payment_status: 0,
                    amount: totalPrice || 0,
                    user_type: 0,
                    user_id: userId || 0,
                    insurance:
                        selectedInsurance && selectedInsurance.scheme_id !== 0
                            ? {
                                  scheme_id: selectedInsurance.scheme_id,
                                  quote_id: selectedInsurance.quote_id,
                                  premium: selectedInsurance.premium,
                                  name: selectedInsurance.name,
                              }
                            : null,
                };
            },

            clearBookingData: () =>
                set({
                    // travelers: [],
                    // contactInfo: {
                    //     bookingForSomeoneElse: false,
                    //     countryCode: "+971",
                    //     bookerName: "",
                    //     email: "",
                    //     phone: "",
                    // },
                    selectedInsurance: {},
                    insurancePlans: [],
                    addOns: {
                        selectedBaggage: null,
                        baggagePrice: 0,
                        selectedMeal: "none",
                        mealPrice: 0,
                    },
                    bookingReference: "",
                    gateway: null,
                }),
        }),
        {
            name: "booking-storage",
            partialize: (state) => ({
                ticket: state.ticket,
                searchInfo: state.searchInfo,
                sessionId: state.sessionId,
                tempId: state.tempId,
                travelers: state.travelers,
                contactInfo: state.contactInfo,
                addOns: state.addOns,
                selectedInsurance: state.selectedInsurance,
                insurancePlans: state.insurancePlans,
                userId: state.userId,
                bookingReference: state.bookingReference,
                gateway: state.gateway,
                isDataModified: state.isDataModified,
                searchURL: state.searchURL,
                baggageData: state.baggageData,
            }),
        }
    )
);

export default useBookingStore;
