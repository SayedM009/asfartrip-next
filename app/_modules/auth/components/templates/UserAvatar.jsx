import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserDropdown from "../organisms/UserDropdown";
import useAuthStore from "../../store/authStore";

export default function UserAvatar() {
    const { user } = useAuthStore();
    return (
        <>
            <Link href="/profile" className="block sm:hidden">
                <Avatar className="rounded-full w-8 h-8 shadow-2xl outline-2 outline-gray-300 dark:outline-white border-2 border-transparent ">
                    <AvatarImage
                        src={user.avatar}
                        alt={`Avatar of ${user?.name}`}
                    />

                    <AvatarFallback className="font-bold">
                        {`${user?.name?.trim()?.split(" ")?.[0]?.[0] || ""}`}
                        {`${user?.name?.trim()?.split(" ")?.[1]?.[0] || ""}`}
                    </AvatarFallback>
                </Avatar>
            </Link>
            {/* On Desktop */}
            <UserDropdown />
        </>
    );
}
