import { create } from "zustand";

export const useDashboardBookingsStore = create((set, get) => ({
    activeTab: "upcoming",
    dataCache: {}, // هنا هنخزن بيانات كل تبويب
    flightBookings: [],
    hotelBookings: [],
    insuranceBookings: [],
    totalCompleted: 0,
    lastFetched: null,
    loading: false,
    error: null,

    setActiveTab: (tab) => set({ activeTab: tab }),

    fetchBookings: async (user_id, user_type, tab = "completed") => {
        const now = Date.now();
        const cache = get().dataCache[tab];
        const FIVE_MINUTES = 5 * 60 * 1000;

        if (cache && now - cache.timestamp < FIVE_MINUTES) {
            const { flight, hotel, insurance, total } = cache.data;
            set({
                flightBookings: flight,
                hotelBookings: hotel,
                insuranceBookings: insurance,
                totalCompleted:
                    tab === "completed" ? total : get().totalCompleted,
                lastFetched: cache.timestamp,
                loading: false,
            });
            return; // نستخدم الكاش فقط
        }

        try {
            set({ loading: true, error: null });

            const formBody = new URLSearchParams({
                user_id: user_id.toString(),
                user_type: user_type.toString(),
                tab: tab,
            });

            const res = await fetch("/api/dashboard/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            });

            const result = await res.json();

            if (!result.success) throw new Error(result.message);

            const { flight, hotel, insurance, total } = result.data;
            const fetchedData = { flight, hotel, insurance, total };

            //  حفظ البيانات في الكاش
            set((state) => ({
                flightBookings: flight,
                hotelBookings: hotel,
                insuranceBookings: insurance,
                totalCompleted:
                    tab === "completed" ? total : state.totalCompleted,
                lastFetched: now,
                loading: false,
                dataCache: {
                    ...state.dataCache,
                    [tab]: { data: fetchedData, timestamp: now },
                },
            }));
        } catch (error) {
            console.error("Booking fetch error:", error);
            set({ error: error.message, loading: false });
        }
    },

    //  لإعادة التحديث يدويًا (Pull to refresh)
    refreshBookings: async (user_id, user_type, tab = "completed") => {
        set((state) => ({
            dataCache: { ...state.dataCache, [tab]: undefined },
        }));
        await get().fetchBookings(user_id, user_type, tab);
    },
}));
