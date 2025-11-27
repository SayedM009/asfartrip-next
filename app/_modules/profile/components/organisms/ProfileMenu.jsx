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
import { motion } from "framer-motion";
import LogoutButton from "../atoms/LogoutButton";
import SectionRow from "../atoms/SectionRow";
import AnimatedSection from "../molecules/AnimatedSection";

export default function ProfileMenu({ setOpenDialog, setShowDeleteDialog }) {
    const p = useTranslations("Profile");
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="px-4 mt-8 space-y-6"
        >
            <AnimatedSection title={p("my_profile")}>
                <SectionRow
                    icon={User2}
                    label={p("personal_info")}
                    onClick={() => setOpenDialog("personal_info")}
                />
                <SectionRow
                    icon={Users}
                    label={p("add_edit_travelers")}
                    onClick={() => setOpenDialog("add_edit_travelers")}
                />
            </AnimatedSection>

            <AnimatedSection title={p("my_bookings")}>
                <SectionRow
                    icon={Plane}
                    label={p("flight_bookings")}
                    onClick={() => setOpenDialog("flight_bookings")}
                />
                <SectionRow
                    icon={BedDouble}
                    label={p("hotel_bookings")}
                    onClick={() => setOpenDialog("hotel_bookings")}
                />

                <SectionRow
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
                <SectionRow
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
