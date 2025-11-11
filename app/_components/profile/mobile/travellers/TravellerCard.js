"use client";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";
import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { useTranslations } from "next-intl";
import { getPassportStatus } from "@/app/_utils/travelers";
import AddEditTraveller from "./AddEditTraveller";

export default function TravellerCard({
    traveller,
    userId,
    userType,
    onDelete,
}) {
    const p = useTranslations("Profile");
    const c = useTranslations("Countries");
    const data = JSON.parse(traveller.json_list || "{}");
    const {
        title = "",
        first_name = "",
        last_name = "",
        dob = "",
        passport_country = "",
        passport_expiry = "",
        passport_no = "",
    } = data;
    const passportStatus = getPassportStatus(passport_expiry);

    return (
        <motion.div
            key={traveller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm"
        >
            <div
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold ${passportStatus.bgColor} ${passportStatus.textColor}`}
            >
                <div className="flex items-center gap-2">
                    {passportStatus.icon}
                    <span>{p(passportStatus.status)}</span>
                </div>
                <span className="uppercase text-[11px]">
                    {formatDisplayDate(passport_expiry, {
                        withYear: true,
                        pattern: "d MMMM yyyy",
                    })}
                </span>
            </div>

            <div className="px-4 pt-2 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-base font-semibold">
                            {title} {first_name} {last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {c(passport_country)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <AddEditTraveller
                            traveller={traveller}
                            userId={userId}
                            userType={userType}
                            asIcon
                        />
                        <button
                            onClick={() => onDelete(traveller.id)}
                            className="transition-colors"
                        >
                            <Trash className="size-5 text-red-500 hover:text-red-600 cursor-pointer" />
                        </button>
                    </div>
                </div>

                <div className="space-y-1 text-xs">
                    {dob && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">{p("dob")} :</span>
                            <span className="font-medium">
                                {formatDisplayDate(dob, {
                                    withYear: true,
                                    pattern: "d MMMM yyyy",
                                })}
                            </span>
                        </div>
                    )}
                    {passport_no && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                                {p("passport_number")} :
                            </span>
                            <span className="font-mono font-medium">
                                {passport_no}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
