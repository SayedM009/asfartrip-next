import { useTranslations } from "next-intl";
import { BadgePercent } from "lucide-react";

function Offers() {
    const p = useTranslations("Profile");
    return (
        <div className="shadow-lg p-4  border  rounded-xl flex flex-col  hover:cursor-pointer user-select-none hover:shadow-xl transition-all col-span-1">
            <div
                className="relative inline-flex items-center justify-center 
                 w-12 h-12 rounded-xl
                 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                 shadow-lg shadow-purple-500/30"
            >
                <div
                    className="absolute inset-0 rounded-xl 
                      bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                      blur-md opacity-60"
                />
                <BadgePercent className="relative w-6 h-6 text-white" />
            </div>

            <h2 className="font-bold text-xl mt-4 mb-2">{p("offers")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {p("offers_description")}
            </p>
        </div>
    );
}

export default Offers;
