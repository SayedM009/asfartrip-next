import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserTravellers } from "../services/fetchUserTravellers";
// import { fetchUserTravellers } from "@/app/_libs/profile";

const useTravellersStore = create(
    persist(
        (set, get) => ({
            travellers: [],
            isLoading: false,
            error: null,

            fetchTravellers: async (userId) => {
                if (!userId) return null;
                try {
                    set({ isLoading: true, error: null });
                    const { data } = await fetchUserTravellers(userId);
                    set({ travellers: data, isLoading: false });
                    return data;
                } catch (err) {
                    console.error(" Error fetching travellers:", err);
                    set({ error: err.message, isLoading: false });
                    return null;
                }
            },

            clearTravellers: () => set({ travellers: [] }),
        }),
        {
            name: "travellers-storage",
            partialize: (state) => ({ travellers: state.travellers }),
        }
    )
);

export default useTravellersStore;
