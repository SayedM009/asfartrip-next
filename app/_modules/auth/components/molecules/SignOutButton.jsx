"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "use-intl";
import { Power } from "lucide-react";

function SignOutButton() {
    const t = useTranslations("Login");
    // Use NextAuth useSession as the authoritative source for auth decisions
    const { status } = useSession();

    // Only render when session has resolved and user is authenticated
    if (status !== "authenticated") return null;

    return (
        <Button
            onClick={() => signOut()}
            className="mx-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 w-auto capitalize font-bold"
        >
            <Power className="size-4" />
            {t("sign_out")}
        </Button>
    );
}

export default SignOutButton;
