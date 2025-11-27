import { motion } from "framer-motion";
import { useTranslations } from "use-intl";
export default function Tabs({ tabs = [], active, onChange }) {
    const p = useTranslations("Profile");
    return (
        <div className="flex justify-between  dark:border-neutral-700">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors relative ${
                        active === tab.value
                            ? "text-black dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {p(String(tab.label).toLocaleLowerCase())}
                    {active === tab.value && (
                        <motion.div
                            layoutId="underline"
                            className="absolute left-0 bottom-0 w-full h-[3px] bg-accent-500 rounded-full"
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
