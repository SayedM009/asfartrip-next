"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "use-intl";

function SignOutButton() {
    const t = useTranslations("Login");
    const { data: session, status } = useSession();
    if (status === "loading") return null; // أثناء التحميل متعرضش حاجة
    if (!session) return null; // لو مفيش مستخدم مسجل، مخفي
    return (
        <Button
            onClick={() => signOut()}
            className="mx-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 w-90 capitalize font-bold"
        >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            {t("sign_out")}
        </Button>
    );
}

export default SignOutButton;
