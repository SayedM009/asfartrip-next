import { motion } from "framer-motion";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

export default function SectionRow({ icon: Icon, label, onClick, danger }) {
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
