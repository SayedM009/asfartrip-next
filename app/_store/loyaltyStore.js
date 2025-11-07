import { create } from "zustand";
import {
    getLoyaltyConfig,
    getUserTier,
    getUserBalance,
} from "@/app/_libs/loyaltyServices";

const BALANCE_TTL = 10 * 60 * 1000; // ✅ مدة التحديث: 10 دقائق (يمكن تعديلها)

const useLoyaltyStore = create((set, get) => ({
    config: null,
    tier: "Bronze",
    balance: 0,
    lastBalanceFetch: 0, // ⏱️ لتتبع آخر وقت تم فيه الجلب
    isLoading: false,
    error: null,

    // 🧠 جلب إعدادات النظام
    fetchConfig: async () => {
        if (get().config) return get().config;
        try {
            set({ isLoading: true, error: null });
            const data = await getLoyaltyConfig();
            set({ config: data, isLoading: false });
            return data;
        } catch (err) {
            console.error("❌ Error loading loyalty config:", err);
            set({ error: err.message, isLoading: false });
            return null;
        }
    },

    // 🧠 جلب Tier
    fetchTier: async (userId) => {
        if (!userId) return null;
        try {
            set({ isLoading: true, error: null });
            const data = await getUserTier(userId);
            set({ tier: { ...data, user_id: userId }, isLoading: false });
            return data;
        } catch (err) {
            console.error("❌ Error loading user tier:", err);
            set({ error: err.message, isLoading: false });
            return null;
        }
    },

    // 🧠 جلب الرصيد مع نظام التحديث الذكي
    fetchBalance: async (userId) => {
        if (!userId) return null;

        const now = Date.now();
        const last = get().lastBalanceFetch;

        // ✅ لو آخر جلب كان أقل من 10 دقائق → رجّع القيمة القديمة
        if (now - last < BALANCE_TTL) {
            console.log("💾 Using cached balance");
            return get().balance;
        }

        try {
            console.log("🔄 Fetching fresh balance from API...");
            set({ isLoading: true, error: null });

            const data = await getUserBalance(userId);
            const points = parseFloat(data?.points_balance || 0);

            set({
                balance: points,
                lastBalanceFetch: now,
                isLoading: false,
            });

            return points;
        } catch (err) {
            console.error("❌ Error loading user balance:", err);
            set({ error: err.message, isLoading: false });
            return 0;
        }
    },

    // 🔹 حساب النقاط المكتسبة
    calculatePoints: (ticketPrice) => {
        const config = get().config;
        if (!config) return 0;
        const rate = parseFloat(config.earning_rate);
        return ticketPrice * rate;
    },

    // 🔹 تحويل النقاط إلى قيمة نقدية (للرصيد الحالي)
    calculateBalanceValue: () => {
        const { config, balance } = get();
        if (!config || !balance) return 0;
        const rate = parseFloat(config.redemption_rate);
        return balance * rate;
    },

    // 🔹 تحويل أي عدد نقاط إلى قيمة نقدية (للاستخدام العام)
    calculateRedemptionValue: (points) => {
        const config = get().config;
        if (!config) return 0;
        const rate = parseFloat(config.redemption_rate);
        return points * rate;
    },

    // 🔹 تحديث يدوي
    setConfig: (newConfig) => set({ config: newConfig }),
    setTier: (tierData) => set({ tier: tierData }),
    setBalance: (points) => set({ balance: points }),
    reset: () =>
        set({
            config: null,
            tier: null,
            balance: 0,
            lastBalanceFetch: 0,
            isLoading: false,
            error: null,
        }),
}));

export default useLoyaltyStore;
