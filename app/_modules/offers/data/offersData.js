// app/_modules/offers/data/offersData.js

export const offers = [
    {
        id: "asfar-friday",
        slug: "asfar-friday",
        validity: {
            from: "2025-12-01",
            to: "2026-02-28",
        },
        title: {
            en: "Asfar Friday",
            ar: "جمعة أسفار",
        },
        subtitle: {
            en: "Flight + 3 nights hotel with Nile view",
            ar: "رحلة طيران + ٣ ليالي فندق مطل على النيل",
        },
        image: {
            en: "/hot_offers/asfar-friday.png",
            ar: "/hot_offers/asfar-friday.png",
        },
        origin: {
            code: "DXB",
            city: { en: "Dubai", ar: "دبي" },
        },
        destination: {
            code: "XXX",
            city: { en: "Anywhere", ar: "أي مكان" },
        },
        priceFrom: {
            amount: 1499,
            currency: "AED",
        },
        airline: {
            en: "Egyptair or similar",
            ar: "مصر للطيران أو ما يعادلها",
        },
        tags: {
            en: ["Family friendly", "Visa assistance available"],
            ar: ["مناسب للعائلات", "توفر مساعدة في التأشيرة"],
        },
        details: {
            en: [
                "Offer includes return flights from Dubai to Cairo and 3 nights hotel accommodation with breakfast.",
                "Eligible for individual travellers and families only. Not valid for travel agencies or corporate bookings.",
                "Limited seats and room availability. Prices may vary based on travel dates and availability at time of booking.",
                "Airport transfers and tours can be added with extra charge.",
            ],
            ar: [
                "يشمل العرض تذاكر طيران ذهاب وعودة من دبي إلى القاهرة مع ٣ ليالي إقامة فندقية تشمل وجبة الإفطار.",
                "العرض متاح للأفراد والعائلات فقط، ولا يشمل وكالات السفر أو الحجوزات المؤسسية.",
                "الأعداد محدودة والأسعار قابلة للتغيير بحسب تاريخ السفر وتوفر المقاعد والغرف عند إتمام الحجز.",
                "يمكن إضافة خدمات الاستقبال من وإلى المطار والرحلات السياحية برسوم إضافية.",
            ],
        },
    },
    {
        id: "istanbul-city-break",
        slug: "riyadh-to-istanbul-city-break",
        validity: {
            from: "2025-11-20",
            to: "2026-03-31",
        },
        title: {
            en: "Istanbul City Break",
            ar: "رحلة مدينة إسطنبول",
        },
        subtitle: {
            en: "Direct flights + 4 nights in Taksim",
            ar: "رحلات مباشرة + ٤ ليالي في تقسيم",
        },
        image: {
            en: "/hot_offers/busisness.jpg",
            ar: "/hot_offers/busisness.jpg",
        },
        origin: {
            code: "RUH",
            city: { en: "Riyadh", ar: "الرياض" },
        },
        destination: {
            code: "IST",
            city: { en: "Istanbul", ar: "إسطنبول" },
        },
        priceFrom: {
            amount: 1999,
            currency: "SAR",
        },
        airline: {
            en: "Turkish Airlines or similar",
            ar: "الخطوط التركية أو ما يعادلها",
        },
        tags: {
            en: ["Couples", "Shopping", "Breakfast included"],
            ar: ["مناسب للزوجين", "تسوق", "يشمل الإفطار"],
        },
        details: {
            en: [
                "Offer includes return economy class flights from Riyadh to Istanbul and 4 nights stay in a 4★ hotel in Taksim.",
                "Breakfast is included daily. City tours can be added upon request.",
                "Valid for individual and family bookings. Not valid for groups over 10 passengers.",
            ],
            ar: [
                "يشمل العرض تذاكر طيران ذهاب وعودة بالدرجة السياحية من الرياض إلى إسطنبول مع ٤ ليالي في فندق ٤ نجوم في منطقة تقسيم.",
                "تشمل الإقامة وجبة الإفطار يوميًا، ويمكن إضافة جولات سياحية داخل المدينة بناءً على الطلب.",
                "العرض متاح للأفراد والعائلات، ولا ينطبق على المجموعات التي تزيد عن ١٠ مسافرين.",
            ],
        },
    },
    {
        id: "maldives-honeymoon",
        slug: "dubai-to-maldives-honeymoon",
        validity: {
            from: "2025-12-15",
            to: "2026-04-30",
        },
        title: {
            en: "Maldives Honeymoon Special",
            ar: "عرض خاص لشهر العسل في المالديف",
        },
        subtitle: {
            en: "5 nights water villa + private transfers",
            ar: "٥ ليالي في فيلا فوق الماء + مواصلات خاصة",
        },
        image: {
            en: "/hot_offers/etihad.png",
            ar: "/hot_offers/etihad.png",
        },
        origin: {
            code: "DXB",
            city: { en: "Dubai", ar: "دبي" },
        },
        destination: {
            code: "MLE",
            city: { en: "Malé", ar: "ماليه" },
        },
        priceFrom: {
            amount: 8999,
            currency: "AED",
        },
        airline: {
            en: "Emirates or similar",
            ar: "طيران الإمارات أو ما يعادلها",
        },
        tags: {
            en: ["Couples only", "All inclusive", "Water villa"],
            ar: ["للزوجين فقط", "شامل تقريبًا", "فيلا فوق الماء"],
        },
        details: {
            en: [
                "Offer includes flights, 5 nights accommodation in a water villa, and private speedboat transfers.",
                "Some meals and activities are included. Exact inclusions vary by resort.",
                "Offer is designed for honeymooners or couples celebrating special occasions.",
            ],
            ar: [
                "يشمل العرض تذاكر الطيران، و٥ ليالي في فيلا فوق الماء، ومواصلات خاصة بالقارب السريع.",
                "تشمل الإقامة بعض الوجبات والأنشطة، ويختلف المحتوى حسب المنتجع.",
                "العرض مخصص لحديثي الزواج أو الأزواج الذين يحتفلون بمناسبة خاصة.",
            ],
        },
    },
    {
        id: "paris-spring",
        slug: "jeddah-to-paris-spring",
        validity: {
            from: "2026-03-01",
            to: "2026-05-31",
        },
        title: {
            en: "Spring in Paris",
            ar: "ربيع باريس",
        },
        subtitle: {
            en: "Romantic escape with Eiffel view hotel",
            ar: "هروب رومانسي مع فندق مطل على برج إيفل",
        },
        image: {
            en: "/hot_offers/tabby.jpg",
            ar: "/hot_offers/tabby.jpg",
        },
        origin: {
            code: "JED",
            city: { en: "Jeddah", ar: "جدة" },
        },
        destination: {
            code: "PAR",
            city: { en: "Paris", ar: "باريس" },
        },
        priceFrom: {
            amount: 3999,
            currency: "SAR",
        },
        airline: {
            en: "Saudi Airlines or similar",
            ar: "الخطوط السعودية أو ما يعادلها",
        },
        tags: {
            en: ["Romantic", "City tours available"],
            ar: ["رومانسي", "يتوفر جولات داخل المدينة"],
        },
        details: {
            en: [
                "Return flights from Jeddah to Paris plus 4 nights hotel near main attractions.",
                "Option to add city tours, Disneyland tickets, and airport transfers.",
            ],
            ar: [
                "يشمل العرض تذاكر طيران ذهاب وعودة من جدة إلى باريس مع ٤ ليالي فندق بالقرب من أهم المعالم السياحية.",
                "يمكن إضافة جولات داخل المدينة وتذاكر ديزني لاند وخدمة الاستقبال في المطار مقابل تكلفة إضافية.",
            ],
        },
    },
    {
        id: "bangkok-budget",
        slug: "dubai-to-bangkok-budget",
        validity: {
            from: "2025-11-25",
            to: "2026-02-28",
        },
        title: {
            en: "Bangkok on a Budget",
            ar: "بانكوك بميزانية اقتصادية",
        },
        subtitle: {
            en: "Affordable package with daily breakfast",
            ar: "باقة اقتصادية مع إفطار يومي",
        },
        image: {
            en: "/hot_offers/UAE.jpg",
            ar: "/hot_offers/UAE.jpg",
        },
        origin: {
            code: "DXB",
            city: { en: "Dubai", ar: "دبي" },
        },
        destination: {
            code: "BKK",
            city: { en: "Bangkok", ar: "بانكوك" },
        },
        priceFrom: {
            amount: 1899,
            currency: "AED",
        },
        airline: {
            en: "Multiple airlines",
            ar: "عدة شركات طيران",
        },
        tags: {
            en: ["Budget", "Shopping", "Street food"],
            ar: ["اقتصادي", "تسوق", "أطعمة الشارع"],
        },
        details: {
            en: [
                "Includes flights and 4 nights in a 3★ hotel with breakfast.",
                "Ideal for budget travellers who want to explore shopping and street food.",
            ],
            ar: [
                "يشمل تذاكر الطيران و٤ ليالي في فندق ٣ نجوم مع وجبة الإفطار.",
                "مثالي للمسافرين الذين يرغبون في تجربة التسوق وأطعمة الشارع بميزانية اقتصادية.",
            ],
        },
    },
];
