import { Link } from "@/i18n/navigation";
import UserDropdown from "../organisms/UserDropdown";
import useAuthStore from "../../store/authStore";
import ShadcnAvatar from "../molecules/ShadcnAvatar";

export default function UserAvatar() {
    const { user } = useAuthStore();
    return (
        <>
            {/* Mobile */}
            <Link href="/profile" className="block sm:hidden">
                <ShadcnAvatar
                    user={user}
                    className={
                        "rounded-full w-8 h-8 shadow-2xl outline-2 outline-gray-300 dark:outline-white border-2 border-transparent "
                    }
                />
            </Link>
            {/* Desktop */}
            <UserDropdown />
        </>
    );
}
