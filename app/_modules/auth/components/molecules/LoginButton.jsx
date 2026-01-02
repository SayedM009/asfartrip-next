"use client";
import { useSession } from "next-auth/react";
import { AuthDialog, UserAvatar } from "../..";

export default function LoginButton() {
    const { status } = useSession();

    if (status === "loading")
        return (
            <div className="lex items-center justify-center rounded text-sm px-3 py-3 border transition-colors duration-200 animate-pulse">
                <div className="h-3 w-12 bg-gray-300 dark:bg-gray-500 rounded" />
            </div>
        );
    if (status === "authenticated") return <UserAvatar />;
    return <AuthDialog />;
}
