import useAuthStore from "@/app/_store/authStore";
import useLoyaltyStore from "@/app/_store/loyaltyStore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
function Status() {
    const p = useTranslations("Profile");
    const {
        user: { id },
    } = useAuthStore();

    const { balance, tier } = useLoyaltyStore();

    console.log(tier);
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.15 },
                },
            }}
            className="px-4 mt-5 grid grid-cols-3 gap-3"
        >
            <StatMotion>
                <StatsCard
                    icon={
                        <Image
                            src="/icons/schedule.png"
                            alt="User Avatar"
                            width={25}
                            height={25}
                            className=" shadow-lg"
                        />
                    }
                    label={p("bookings")}
                    value={id}
                />
            </StatMotion>
            <StatMotion>
                <StatsCard
                    icon={
                        <Image
                            src="/icons/star.png"
                            alt="User Avatar"
                            width={25}
                            height={25}
                            className=" shadow-lg"
                        />
                    }
                    label={p("points")}
                    value={balance}
                />
            </StatMotion>
            <StatMotion>
                <StatsCard
                    icon={
                        <Image
                            src="/icons/trophy.png"
                            alt="User Avatar"
                            width={25}
                            height={25}
                            className=" shadow-lg"
                        />
                    }
                    label={p("tier")}
                    value={tier?.tier_name}
                />
            </StatMotion>
        </motion.div>
    );
}

export default Status;

/* --- Helpers --- */
const StatMotion = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }}
    >
        {children}
    </motion.div>
);

function StatsCard({ icon, label, value }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 flex flex-col items-center justify-center py-4 shadow-[0_4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)]"
        >
            <div className="mb-2">{icon}</div>
            <p className="text-[17px] font-semibold">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {label}
            </p>
        </motion.div>
    );
}
