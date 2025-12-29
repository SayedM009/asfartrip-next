"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, CalendarRange, UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

// استبدال المسار القديم
import useCheckLocal from "@/app/_hooks/useCheckLocal";

import { Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";
import useAuthStore from "../../store/authStore";
import ShadcnAvatar from "../molecules/ShadcnAvatar";

export default function UserDropdown() {
    const { user } = useAuthStore();
    const l = useTranslations("Login");
    const { isRTL } = useCheckLocal();
    const condition = isRTL ? "rtl" : "ltr";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border-0 outline-0 ">
                <ShadcnAvatar
                    user={user}
                    className={"h-8 w-8 cursor-pointer border hidden sm:block"}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                dir={condition}
                className="w-65 p-0 overflow-hidden rounded-lg shadow-lg"
            >
                <section className="p-3 border-b">
                    <div className="flex items-center gap-4">
                        <ShadcnAvatar
                            user={user}
                            className={
                                "h-8 w-8 cursor-pointer border hidden sm:block"
                            }
                        />
                        <div>
                            <p className="font-semibold text-sm capitalize">
                                {user?.name.toLocaleLowerCase()}
                            </p>
                            <p className="font-semibold text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="p-2">
                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm  gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <Link
                            href="/profile/dashboard"
                            className="flex items-center gap-2"
                        >
                            <Squares2X2Icon className="size-4 text-accent-500" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm  gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <Link
                            href="/profile/profile-info"
                            className="flex items-center gap-2"
                        >
                            <UserIcon className="size-4 text-accent-500" />
                            Profile Info
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm flex items-center gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <Link
                            href="/profile/travellers"
                            className="flex items-center gap-2"
                        >
                            <UserGroupIcon className="size-4.5 text-accent-500" />
                            {l("travelers")}
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2 px-3 text-sm flex items-center gap-2 hover:bg-muted transition-colors hover:outline-0">
                        <CalendarRange className="size-4 text-accent-500" />
                        {l("my_bookings")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className={`cursor-pointer py-2 px-3 text-sm text-red-600 dark:text-red-500  flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-200 rounded transition-colors hover:outline-0 ${
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
