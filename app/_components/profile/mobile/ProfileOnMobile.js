"use client";

import { useState } from "react";
import {
    BedDouble,
    Users,
    User2,
    Plane,
    ShieldCheck,
    HelpCircle,
    Trash2,
    Headset,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useTranslations } from "next-intl";
import ChevronBasedOnLanguage from "../../ui/ChevronBasedOnLanguage";
import { LogoutButton } from "./LogoutButton";
import { Header } from "./Header";
import Status from "./Status";
import TravelerBasicFields from "../../TravelerBasicFields";

export default function ProfileOnMobile() {
    const p = useTranslations("Profile");
    const [openDialog, setOpenDialog] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { isRTL } = useCheckLocal();

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

                    {/* 📊 Stats Section */}
                    <Status />

                    {/* 🧩 Sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="px-4 mt-8 space-y-6"
                    >
                        <AnimatedSection title={p("my_profile")}>
                            <Row
                                icon={User2}
                                label={p("personal_info")}
                                onClick={() => setOpenDialog("Personal Info")}
                            />
                            <Row
                                icon={Users}
                                label={p("add_edit_travelers")}
                                onClick={() => setOpenDialog("Add Traveller")}
                            />
                        </AnimatedSection>

                        <AnimatedSection title={p("my_bookings")}>
                            <Row
                                icon={BedDouble}
                                label={p("hotel_bookings")}
                                onClick={() => setOpenDialog("Hotel Bookings")}
                            />
                            <Row
                                icon={Plane}
                                label={p("flight_bookings")}
                                onClick={() => setOpenDialog("Flight Bookings")}
                            />
                            <Row
                                icon={ShieldCheck}
                                label={p("insurance_bookings")}
                                onClick={() =>
                                    setOpenDialog("Insurance Bookings")
                                }
                            />
                        </AnimatedSection>

                        {/* <AnimatedSection title="Services & Extras">
                            <Row
                                icon={Car}
                                label="Airport Transfers"
                                onClick={() =>
                                    setOpenDialog("Airport Transfers")
                                }
                            />
                            <Row
                                icon={Gift}
                                label="Special Offers"
                                onClick={() => setOpenDialog("Special Offers")}
                            />
                            <Row
                                icon={Building2}
                                label="Business Services"
                                onClick={() =>
                                    setOpenDialog("Business Services")
                                }
                            />
                            <Row
                                icon={BusFront}
                                label="Travel Insurance"
                                onClick={() =>
                                    setOpenDialog("Travel Insurance")
                                }
                            />
                        </AnimatedSection> */}

                        <AnimatedSection title={p("help_account")}>
                            <Row
                                icon={HelpCircle}
                                label={p("FQAs")}
                                onClick={() => setOpenDialog("FAQs")}
                            />
                            <Row
                                icon={Headset}
                                label={p("contact_support")}
                                onClick={() => setOpenDialog("Contact Us")}
                            />
                            <Row
                                icon={Trash2}
                                label={p("delete_account")}
                                danger
                                onClick={() => setShowDeleteDialog(true)}
                            />
                        </AnimatedSection>

                        {/*  Logout Button */}
                        <LogoutButton />
                    </motion.div>
                </motion.div>

                {/* 🪟 Fullscreen Dialogs */}
                <Dialog
                    open={!!openDialog}
                    onOpenChange={() => setOpenDialog(null)}
                >
                    <DialogContent
                        className={`max-w-none h-screen bg-white dark:bg-[#111] p-4 overflow-y-auto rounded-none open-slide-left close-slide-left `}
                    >
                        <DialogHeader className="flex flex-row h-fit">
                            <DialogTitle className="text-lg font-semibold">
                                {openDialog}
                            </DialogTitle>
                            {/* <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                Manage your {openDialog?.toLowerCase()}{" "}
                                information here.
                            </DialogDescription> */}
                        </DialogHeader>
                        <div className="space-y-4">
                            {renderDialogBody(openDialog)}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ❗ Delete Account Popup */}
                <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                >
                    <DialogContent className="max-w-sm p-6 rounded-2xl bg-white dark:bg-[#1e1e20] border border-gray-100 dark:border-neutral-800 text-center shadow-xl data-[state=open]:animate-[scaleUp_0.3s_ease-out]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-red-500">
                                Delete Account
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                This action is irreversible. Are you sure you
                                want to delete your account?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.section>
        </AnimatePresence>
    );
}

/* --- Helpers --- */

const AnimatedSection = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <Section title={title}>{children}</Section>
    </motion.div>
);

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2 px-1">
                {title}
            </h2>
            <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-[#e5e8ef] dark:border-neutral-800 divide-y divide-[#e5e8ef] dark:divide-neutral-800 overflow-hidden">
                {children}
            </div>
        </div>
    );
}

function Row({ icon: Icon, label, onClick, danger }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors ${
                danger
                    ? "text-red-500"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800"
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon
                    className={`w-5 h-5 ${
                        danger
                            ? "text-red-500"
                            : "text-gray-600 dark:text-gray-300"
                    }`}
                />
                <span className="text-[15px] font-medium">{label}</span>
            </div>
            {!danger && <ChevronBasedOnLanguage size="4" icon="arrow" />}
        </motion.button>
    );
}

function renderDialogBody(type) {
    switch (type) {
        case "Personal Info":
            return <TravelerBasicFields />;
        case "Add Traveller":
            return (
                <p className="text-sm text-gray-500">
                    Add travellers to your saved list.
                </p>
            );
        case "FAQs":
            return (
                <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
                    <li>How do I change my booking?</li>
                    <li>Can I refund a ticket?</li>
                    <li>How do I contact support?</li>
                </ul>
            );
        default:
            return <p className="text-sm text-gray-500">Content for {type}.</p>;
    }
}
