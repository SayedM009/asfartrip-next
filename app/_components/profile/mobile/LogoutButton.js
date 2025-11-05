import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export function LogoutButton() {
    const p = useTranslations("Profile");
    const handleLogout = async () => {
        await signOut();
        window.location.href = "/";
    };
    return (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full py-5 rounded-2xl bg-[#ffecec] hover:bg-[#ffd9d9] text-[#d64545] font-semibold shadow-md transition-all"
            >
                <LogOut className="w-4 h-4 mr-2" />
                {p("logout")}
            </Button>
        </motion.div>
    );
}
