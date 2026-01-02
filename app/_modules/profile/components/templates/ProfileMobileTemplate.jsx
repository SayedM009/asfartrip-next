"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sections from "../organisms/ProfileMenuSections";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import useAuthStore from "@/app/_modules/auth/store/authStore";
import DeleteAccount from "../organisms/DeleteAccountDialog";
import FullscreenDialog from "../organisms/ProfileFullscreenDialog";
import Status from "../molecules/ProfileStatus";
import Header from "../molecules/ProfileHeader";
import { useDashboardBookingsStore } from "../../store/dashboardBookingStore";

export default function ProfileOnMobile() {
    const [openDialog, setOpenDialog] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { isRTL } = useCheckLocal();
    const { user } = useAuthStore();
    const { activeTab, fetchBookings } = useDashboardBookingsStore();

    useEffect(() => {
        if (!user?.id || !user?.usertype) return;
        fetchBookings(user?.id, user?.usertype, "completed");
    }, [activeTab, fetchBookings, user?.id, user?.usertype]);

    if (!user?.id || !user?.usertype) return null;

    return (
        <AnimatePresence>
            <motion.section
                key="profile-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen pb-24 relative overflow-hidden"
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
