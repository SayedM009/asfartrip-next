"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, CalendarRange } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import useCheckLocal from "../_hooks/useCheckLocal";
import useAuthStore from "../_store/authStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";

export default function UserDropdown() {
    const { user } = useAuthStore();
    const l = useTranslations("Login");
    const { isRTL } = useCheckLocal();
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
