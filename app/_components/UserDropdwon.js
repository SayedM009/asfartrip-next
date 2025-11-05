"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User, LogOut, Settings, CalendarRange } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCurrency } from "../_context/CurrencyContext";
import Image from "next/image";
import useLoyaltyStore from "../_store/loyaltyStore";
import useCheckLocal from "../_hooks/useCheckLocal";
import useAuthStore from "../_store/authStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";

export default function UserDropdown() {
    const { user } = useAuthStore();
    const l = useTranslations("Login");
    const Loyalty = useTranslations("Loyalty");
    const { isRTL } = useCheckLocal();
    const { balance, tier } = useLoyaltyStore();
    const { formatPrice } = useCurrency();
    const condition = isRTL ? "rtl" : "ltr";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border hidden sm:block">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                        <Image
                            src="/avatar.webp"
                            alt={`Alternative avatar for ${user?.avatar}`}
                            width={36}
                            height={36}
                            referrerPolicy="no-referrer"
                            className="rounded-full shadow-lg"
                        />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                dir={condition}
                className="w-65 p-0 overflow-hidden rounded-lg shadow-lg"
            >
                <section className={`p-3 bg-gray-50 dark:bg-gray-800 border-b`}>
                    <div className="flex items-center gap-4 mb-2">
                        <Avatar className="h-7 w-7 cursor-pointer border">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>
                                <Image
                                    src="/avatar.webp"
                                    alt={`Alternative avatar for ${user?.avatar}`}
                                    width={24}
                                    height={24}
                                    referrerPolicy="no-referrer"
                                />
                            </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-sm">{user?.name}</p>
                    </div>
                    {/* <div className="flex items-center gap-2 ">
                        <span className="bg-[#1fa86abe] text-xs p-0.5 px-1 rounded text-white">
                            {Loyalty(tier?.tier_name)}
                        </span>
                        <div className="flex items-center gap-2 ">
                            <Image
                                src="/icons/pay-with-coin.png"
                                alt="Pay with coins"
                                width={15}
                                height={15}
                            />
                            <span className="font-semibold text-sm">
                                {balance}
                            </span>
                            <p className="capitalize text-xs">
                                {l("points")} ≈
                            </p>
                            <span className="text-accent-400 font-semibold">
                                {formatPrice(balance)}
                            </span>
                        </div>
                    </div> */}
                </section>

                <section className="p-2">
                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm  gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2"
                        >
                            <Settings className="size-4 text-accent-500" />
                            {l("manage_account")}
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm flex items-center gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <CalendarRange className="size-4 text-accent-500" />
                        {l("my_bookings")}
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm flex items-center gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <UserGroupIcon className="size-4.5 text-accent-500" />
                        {l("travelers")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className={`cursor-pointer py-2 px-3 text-sm text-red-600 dark:text-red-500  flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-100 rounded transition-colors hover:outline-0 ${
                            isRTL && "flex-row-reverse justify-end"
                        }`}
                        onClick={signOut}
                    >
                        <LogOut className={`size-4 ${isRTL && "rotate-180"}`} />
                        {l("sign_out")}
                    </DropdownMenuItem>
                </section>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
