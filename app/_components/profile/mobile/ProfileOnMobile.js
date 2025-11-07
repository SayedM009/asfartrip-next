"use client";

import { useEffect, useState } from "react";
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
import { useDashboardBookingsStore } from "@/app/_store/dashboardBookingStore";
import FlightBookings from "./bookings/FlightBookings";
import HotelBookings from "./bookings/HotelBookings";
import InsuranceBookings from "./bookings/InsuranceBookings";
import { Link } from "@/i18n/navigation";
import PersonalInfo from "./PersonalInfo";

export default function ProfileOnMobile() {
    const p = useTranslations("Profile");
    const [openDialog, setOpenDialog] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { isRTL } = useCheckLocal();

    const { activeTab, fetchBookings, flightBookings } =
        useDashboardBookingsStore();

    useEffect(() => {
        fetchBookings(52, 2, "cancelled");
    }, [activeTab, fetchBookings]);

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
                                onClick={() => setOpenDialog("personal_info")}
                            />
                            <Row
                                icon={Users}
                                label={p("add_edit_travelers")}
                                onClick={() =>
                                    setOpenDialog("add_edit_travelers")
                                }
                            />
                        </AnimatedSection>

                        <AnimatedSection title={p("my_bookings")}>
                            <Row
                                icon={Plane}
                                label={p("flight_bookings")}
                                onClick={() => setOpenDialog("flight_bookings")}
                            />
                            <Row
                                icon={BedDouble}
                                label={p("hotel_bookings")}
                                onClick={() => setOpenDialog("hotel_bookings")}
                            />

                            <Row
                                icon={ShieldCheck}
                                label={p("insurance_bookings")}
                                onClick={() =>
                                    setOpenDialog("insurance_bookings")
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
                            <Link
                                href="/faqs"
                                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span className="text-[15px] font-medium">
                                        {p("FQAs")}
                                    </span>
                                </div>
                                {/* <ChevronBasedOnLanguage size="4" icon="arrow" /> */}
                            </Link>

                            <Link
                                href="/contact-us"
                                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Headset className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span className="text-[15px] font-medium">
                                        {p("contact_support")}
                                    </span>
                                </div>
                                {/* <ChevronBasedOnLanguage size="4" icon="arrow" /> */}
                            </Link>
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
                                {openDialog && p(`${openDialog}`)}
                            </DialogTitle>
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
                                {p("delete_account")}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                {p("delete_account_confirmation")}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 mt-6 ">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                {p("cancel")}
                            </Button>
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                                {p("delete")}
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
        case "personal_info":
            return <PersonalInfo />;
        case "add_edit_travelers":
            return <p>add travellers</p>;
        case "flight_bookings":
            return <FlightBookings />;
        case "hotel_bookings":
            return <HotelBookings />;
        case "insurance_bookings":
            return <InsuranceBookings />;

        default:
            return <p className="text-sm text-gray-500">Content for {type}.</p>;
    }
}
