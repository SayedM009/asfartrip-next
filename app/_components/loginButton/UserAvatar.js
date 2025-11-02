import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import UserDropdown from "../UserDropdwon";

export default function UserAvatar({ user }) {
    return (
        <>
            <Link href="/profile" className="block sm:hidden">
                <Avatar>
                    <AvatarImage
                        src={user.avatar ? user.avatar : "avatar.webp"}
                        alt={`Alternative avatar for ${user?.name}`}
                    />

                    <AvatarFallback>
                        <Image
                            src={user?.avatar}
                            alt={`Alternative avatar for ${user?.avatar}`}
                            width={36}
                            height={36}
                            referrerPolicy="no-referrer"
                        />
                    </AvatarFallback>
                </Avatar>
            </Link>
            {/* On Desktop */}
            <UserDropdown />
        </>
    );
}
