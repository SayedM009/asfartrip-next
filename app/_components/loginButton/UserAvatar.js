import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import UserDropdown from "../UserDropdwon";

export default function UserAvatar({ user }) {
    return (
        <>
            <Link href="/profile" className="block sm:hidden">
                <Avatar className="rounded-full w-8 h-8 shadow-2xl outline-2 outline-gray-400 dark:outline-white border-2 border-transparent ">
                    <AvatarImage
                        src={user.avatar ? user.avatar : "avatar.webp"}
                        alt={`Alternative avatar for ${user?.name}`}
                    />

                    <AvatarFallback>
                        <Image
                            src="/avatar.webp"
                            alt={`Alternative avatar for ${user?.name}`}
                            width={36}
                            height={36}
                            referrerPolicy="no-referrer"
                            className="rounded-full shadow-lg"
                        />
                    </AvatarFallback>
                </Avatar>
            </Link>
            {/* On Desktop */}
            <UserDropdown />
        </>
    );
}
