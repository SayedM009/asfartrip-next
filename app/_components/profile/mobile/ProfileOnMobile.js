"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardBookingsStore } from "@/app/_store/dashboardBookingStore";

import Header from "./Header";
import Status from "./Status";
import DeleteAccount from "./DeleteAccount";
import Sections from "./Section";
import FullscreenDialog from "./FullscreenDialog";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import useAuthStore from "@/app/_modules/auth/store/authStore";

export default function ProfileOnMobile() {
    const [openDialog, setOpenDialog] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { isRTL } = useCheckLocal();

    const {
        user: { id, usertype },
    } = useAuthStore();
    const { activeTab, fetchBookings } = useDashboardBookingsStore();

    useEffect(() => {
        if (!id || !usertype) return null;
        fetchBookings(id, usertype, "cancelled");
    }, [activeTab, fetchBookings, id, usertype]);

    return (
        <AnimatePresence>
            <motion.section
                key="profile-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen bg-[#f9fafb] dark:bg-[#111] text-[#33394c] dark:text-gray-100 pb-24 relative overflow-hidden"
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Background motion when dialogs open */}
                <motion.div
                    animate={
                        openDialog
                            ? { scale: 0.98, opacity: 0.8, filter: "blur(2px)" }
                            : { scale: 1, opacity: 1, filter: "blur(0px)" }
                    }
                    transition={{ duration: 0.3 }}
                >
                    {/* Header */}
                    <Header />

                    {/*  Stats Section */}
                    <Status />

                    {/*  Sections */}
                    <Sections
                        setOpenDialog={setOpenDialog}
                        setShowDeleteDialog={setShowDeleteDialog}
                    />
                </motion.div>

                {/*  Fullscreen Dialogs */}
                <FullscreenDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                />

                {/*  Delete Account Popup */}
                <DeleteAccount
                    showDeleteDialog={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                />
            </motion.section>
        </AnimatePresence>
    );
}
