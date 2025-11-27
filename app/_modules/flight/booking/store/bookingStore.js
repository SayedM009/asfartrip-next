// app/_modules/booking/store/bookingStore.js
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
            userType: "",
            bookingReference: "",
            gateway: null,
            isDataModified: false,
            searchURL: "",
            baggageData: {
                outward: [],
                return: [],
            },
            sameBookingURL: "",
            priceChangeData: null,

            // ================= Helpers =================
            setPriceChangeData: (data) => set({ priceChangeData: data }),
            clearPriceChangeData: () => set({ priceChangeData: null }),

            setSameBookingURL: (url) => set({ sameBookingURL: url }),

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

            // ================= Search Info + Travelers =================
            setSearchInfo: (newSearchInfo) => {
                const prev = get().searchInfo;

                const isChanged =
                    JSON.stringify(prev) !== JSON.stringify(newSearchInfo);

                if (!prev || isChanged) {
                    const ADT = newSearchInfo?.ADT || 1;
                    const CHD = newSearchInfo?.CHD || 0;
                    const INF = newSearchInfo?.INF || 0;
                    const total = ADT + CHD + INF;

                    const travelers = Array.from({ length: total }).map(
                        (_, index) => {
                            let type = "Adult";
                            if (index >= ADT && index < ADT + CHD)
                                type = "Child";
                            if (index >= ADT + CHD) type = "Infant";

                            return {
                                id: crypto.randomUUID(),
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
                        }
                    );

                    set({
                        searchInfo: newSearchInfo,
                        travelers,
                        bookingReference: "",
                        gateway: null,
                        isDataModified: true,
                    });
                } else {
                    set({ searchInfo: newSearchInfo });
                }
            },

            // ================= Base setters =================
            setSessionId: (newSessionId) => set({ sessionId: newSessionId }),
            setTempId: (newTempId) => set({ tempId: newTempId }),
            setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
            setSpecialRequest: (request) => set({ specialRequest: request }),
            setCouponCode: (couponCode) => set({ couponCode }),
            setCart: (newCart) => set({ cart: newCart }),

            setSelectedInsurance: (insurance) =>
                set({ selectedInsurance: insurance, isDataModified: true }),

            setInsurancePlans: (plans) => set({ insurancePlans: plans || [] }),

            // ================= Travelers =================
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

            // ================= Contact Info =================
            updateContactInfo: (data) =>
                set((state) => ({
                    contactInfo: { ...state.contactInfo, ...data },
                    isDataModified: true,
                })),

            // ================= Add-ons =================
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

            // ================= Totals =================
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

            getInsuranceTotal: () => get().selectedInsurance?.premium || 0,

            getAddOnsTotal: () =>
                get().addOns.baggagePrice + get().addOns.mealPrice,

            // ================= Validation helpers  =================
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

            // ================= Booking meta =================
            setUserId: (id) => set({ userId: id || 0 }),
            setUserType: (type) => set({ userType: type || "" }),

            setBookingRef: (data) =>
                set({
                    bookingReference: data || "",
                }),

            setGateway: (data) => {
                set({
                    gateway: {
                        ifrurl: data || null,
                    },
                });
            },

            // ================= Passenger Full Details =================
            buildPassengerFullDetails: (otherPassengers) => {
                const pad = (n) => n.toString().padStart(2, "0");
                const toDDMMYYYY = (d) => {
                    if (!d) return "";
                    const dt = new Date(d);
                    return `${pad(dt.getDate())}/${pad(
                        dt.getMonth() + 1
                    )}/${dt.getFullYear()}`;
                };
                const upper = (s) => (s || "").toUpperCase();
                const code2 = (c) => upper((c || "").substring(0, 2));
                const getGender = (title) =>
                    (title || "").toLowerCase().includes("mr") ||
                        (title || "").toLowerCase().includes("master") ||
                        (title || "").toLowerCase().includes("mstr")
                        ? "Male"
                        : "Female";

                const structure = {
                    title: [],
                    first: [],
                    last: [],
                    passport_no: [],
                    passport_issued: [],
                    dob: [],
                    passport_exp: [],
                    gender: [],
                };

                otherPassengers.forEach((p) => {
                    const typeKey = `${p.travelerType.toLowerCase()}s${p.travelerNumber
                        }`;
                    structure.title.push({ [typeKey]: p.title || "" });
                    structure.first.push({ [typeKey]: upper(p.firstName) });
                    structure.last.push({ [typeKey]: upper(p.lastName) });
                    structure.passport_no.push({
                        [typeKey]: p.passportNumber || "",
                    });
                    structure.passport_issued.push({
                        [typeKey]: code2(p.nationality),
                    });
                    structure.dob.push({
                        [typeKey]: toDDMMYYYY(p.dateOfBirth),
                    });
                    structure.passport_exp.push({
                        [typeKey]: toDDMMYYYY(p.passportExpiry),
                    });
                    structure.gender.push({ [typeKey]: getGender(p.title) });
                });

                return btoa(JSON.stringify(structure));
            },

            // ================= Final Payload =================
            getFinalPayload: () => {
                const state = get();
                const {
                    travelers,
                    contactInfo,
                    sessionId,
                    tempId,
                    selectedInsurance,
                } = state;

                const cid = String(tempId || "");

                const pad = (n) => n.toString().padStart(2, "0");
                const toDDMMYYYY = (d) => {
                    if (!d) return "";
                    const dt = new Date(d);
                    return `${pad(dt.getDate())}/${pad(
                        dt.getMonth() + 1
                    )}/${dt.getFullYear()}`;
                };
                const upper = (s) => (s || "").toUpperCase();
                const genderFrom = (title) =>
                    (title || "").toLowerCase().includes("mr") ||
                        (title || "").toLowerCase().includes("master")
                        ? "Male"
                        : "Female";
                const code2 = (c) => upper((c || "").substring(0, 2));

                // === العمر لتحديد التصنيف مرة أخرى ===
                const now = new Date();
                const getAge = (dob) => {
                    if (!dob) return 0;
                    const birth = new Date(dob);
                    let age = now.getFullYear() - birth.getFullYear();
                    const m = now.getMonth() - birth.getMonth();
                    if (m < 0 || (m === 0 && now.getDate() < birth.getDate()))
                        age--;
                    return age;
                };

                const classify = (t) => {
                    const age = getAge(t.dateOfBirth);
                    if (age >= 12) return "Adult";
                    if (age >= 2) return "Child";
                    return "Infant";
                };

                const classifiedTravelers = travelers.map((t) => ({
                    ...t,
                    classifiedType: classify(t),
                }));

                const adults = classifiedTravelers.filter(
                    (t) => t.classifiedType === "Adult"
                );
                const childs = classifiedTravelers.filter(
                    (t) => t.classifiedType === "Child"
                );
                const infants = classifiedTravelers.filter(
                    (t) => t.classifiedType === "Infant"
                );

                // ==== Lead Passenger ====
                const lead = adults[0] || classifiedTravelers[0];

                // ==== Other Passengers ====
                const otherPassengers = [
                    ...adults.slice(1),
                    ...childs,
                    ...infants,
                ];

                // ==== Contact info ====
                const fullPhone = `${contactInfo.countryCode}${contactInfo.phone}`;

                // ==== Traveler Details Object (TD) ====
                const TD = {
                    housenum: "786",
                    zip: "20772",
                    city: "Dubai",
                    country_code: contactInfo.countryCode || "+971",
                    mobile: fullPhone,
                    email: contactInfo.email || "",
                    street_address: "Al Garhoud",
                    country: "AE",
                    total: btoa(String(state.getTotalPrice() || "0")),
                    tripdate: new Date()
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-"),
                    cart_id: cid,
                    cid: btoa(JSON.stringify(["FLIGHT", cid])),
                };

                // ===== Lead Passenger Fields =====
                TD[`selTitle${cid}`] = lead.title || "";
                TD[`first_name${cid}`] = upper(lead.firstName);
                TD[`last_name${cid}`] = upper(lead.lastName);
                TD[`passport_no${cid}`] = lead.passportNumber || "";
                TD[`issued_country${cid}`] = code2(lead.nationality);
                TD[`selGender${cid}`] = genderFrom(lead.title);
                TD[`txtdob${cid}`] = toDDMMYYYY(lead.dateOfBirth);
                TD[`txtped${cid}`] = toDDMMYYYY(lead.passportExpiry);

                // === Prepare arrays for other passengers ===
                const arrKeys = [
                    "pselTitle",
                    "pfirst_name",
                    "plast_name",
                    "ppassport_no",
                    "pissued_country",
                    "ptxtdob",
                    "ptxtped",
                    "pselGender",
                ];
                arrKeys.forEach((k) => {
                    TD[`${k}${cid}`] = [];
                });

                // === Push Other Passenger Data ===
                otherPassengers.forEach((p) => {
                    TD[`pselTitle${cid}`].push(p.title || "");
                    TD[`pfirst_name${cid}`].push(upper(p.firstName));
                    TD[`plast_name${cid}`].push(upper(p.lastName));
                    TD[`ppassport_no${cid}`].push(p.passportNumber || "");
                    TD[`pissued_country${cid}`].push(code2(p.nationality));
                    TD[`ptxtdob${cid}`].push(toDDMMYYYY(p.dateOfBirth));
                    TD[`ptxtped${cid}`].push(toDDMMYYYY(p.passportExpiry));
                    TD[`pselGender${cid}`].push(genderFrom(p.title));
                });

                // ==== Guest Information ====
                let GUEST_FIRSTNAME = upper(lead.firstName);
                let GUEST_LASTNAME = upper(lead.lastName);
                let leadpax = `${GUEST_FIRSTNAME} ${GUEST_LASTNAME}`;

                if (
                    contactInfo.bookingForSomeoneElse &&
                    contactInfo.bookerName?.trim()
                ) {
                    const parts = contactInfo.bookerName
                        .trim()
                        .toUpperCase()
                        .split(" ");
                    GUEST_FIRSTNAME = parts[0] || "";
                    GUEST_LASTNAME = parts.slice(1).join(" ") || "";
                    leadpax = `${GUEST_FIRSTNAME} ${GUEST_LASTNAME}`;
                }

                // ==== passenger_full_details ====
                let passenger_full_details = "";

                if (otherPassengers.length > 0) {
                    let adultIdx = 2,
                        childIdx = 1,
                        infantIdx = 1;

                    const numbered = otherPassengers.map((p) => {
                        let newNumber = 1;
                        if (p.classifiedType === "Adult")
                            newNumber = adultIdx++;
                        else if (p.classifiedType === "Child")
                            newNumber = childIdx++;
                        else if (p.classifiedType === "Infant")
                            newNumber = infantIdx++;

                        return {
                            ...p,
                            travelerType: p.classifiedType,
                            travelerNumber: newNumber,
                        };
                    });

                    passenger_full_details =
                        state.buildPassengerFullDetails(numbered);
                }

                // ========= Final Payload ==========
                const payload = {
                    TravelerDetails: TD,
                    passenger_full_details,
                    GUEST_FIRSTNAME,
                    GUEST_LASTNAME,
                    GUEST_EMAIL: contactInfo.email || "admin@asfartrip.com",
                    GUEST_PHONE: fullPhone || "97143409933",
                    leadpax,
                    session_id: sessionId,
                    temp_id: tempId,
                    cid,
                    transaction_status: "PROCESS",
                    payment_method: "Payment Gateway",
                    booking_status: "PROCESS",
                    currency: "AED",
                    rate: 1,
                    payment_status: 0,
                    amount: state.getTotalPrice(),
                    user_type: state.userType,
                    user_id: state.userId || 0,
                };

                // === Insurance ===
                if (
                    selectedInsurance &&
                    selectedInsurance.scheme_id &&
                    selectedInsurance.scheme_id !== 0
                ) {
                    payload.insurance = {
                        scheme_id: selectedInsurance.scheme_id,
                        quote_id: selectedInsurance.quote_id || null,
                        premium: selectedInsurance.premium || 0,
                        name: selectedInsurance.name || "",
                    };
                }

                return payload;
            },

            // ================= Clear =================
            clearBookingData: () => {
                console.log("🧹 clearBookingData called - clearing old booking data");
                set({
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
                    baggageData: {
                        outward: null,
                        return: null,
                    },
                    searchURL: ""
                });
            },
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
                userType: state.userType,
                bookingReference: state.bookingReference,
                gateway: state.gateway,
                isDataModified: state.isDataModified,
                searchURL: state.searchURL,
                baggageData: state.baggageData,
                sameBookingURL: state.sameBookingURL,
                priceChangeData: state.priceChangeData,
            }),
        }
    )
);

export default useBookingStore;
