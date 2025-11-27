"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTravellersManager } from "@/app/_hooks/useTravellersManager";
import TravellerCard from "../molecules/TravellerCard";
import TravellerCardSkeleton from "../molecules/TravellerCardSkeleton";
import AddEditTraveller from "./AddEditTraveller";
import AirplaneStairs from "@/app/_components/SVG/AirplaneStairs";
import { useAuthStore } from "@/app/_modules/auth";

export default function Travellers() {
    const p = useTranslations("Profile");
    const { user } = useAuthStore();
    const { travellers, isLoading, handleDelete } = useTravellersManager(
        user?.id
    );

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="flex-1 overflow-y-auto space-y-4 pb-24">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="skeleton" className="grid gap-3 mt-3">
                            {[...Array(3)].map((_, i) => (
                                <TravellerCardSkeleton key={i} />
                            ))}
                        </motion.div>
                    ) : travellers?.length > 0 ? (
                        <motion.div
                            key="travellers"
                            className="grid gap-3 mt-3"
                        >
                            {travellers.map((t) => (
                                <TravellerCard
                                    key={t.id}
                                    traveller={t}
                                    userId={user?.id}
                                    userType={user?.usertype}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            className="flex flex-col items-center justify-center py-20 text-center gap-4"
                        >
                            <AirplaneStairs />
                            <div className="max-w-xs">
                                <h3 className="text-lg font-semibold">
                                    {p("no_travellers")}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {p("add_traveller_description")}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AddEditTraveller userId={user?.id} userType={user?.usertype} />
        </div>
    );
}
