import { Link } from "@/i18n/navigation";
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
import { useTranslations } from "next-intl";
import { LogoutButton } from "./LogoutButton";
import { motion, AnimatePresence } from "framer-motion";
import ChevronBasedOnLanguage from "../../ui/ChevronBasedOnLanguage";

export default function Sections({ setOpenDialog, setShowDeleteDialog }) {
    const p = useTranslations("Profile");
    return (
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
                    onClick={() => setOpenDialog("add_edit_travelers")}
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
                    onClick={() => setOpenDialog("insurance_bookings")}
                />
            </AnimatedSection>

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
