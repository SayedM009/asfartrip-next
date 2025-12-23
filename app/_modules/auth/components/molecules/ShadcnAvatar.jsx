import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function ShadcnAvatar({ user, className }) {
    return (
        <div>
            <Avatar className={`relative ${className}`}>
                {user?.avatar ? (
                    <Image
                        src={user?.avatar}
                        alt={user?.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <AvatarFallback className="font-bold">
                        {`${user?.name?.trim()?.split(" ")?.[0]?.[0] || ""}`}
                        {`${user?.name?.trim()?.split(" ")?.[1]?.[0] || ""}`}
                    </AvatarFallback>
                )}
            </Avatar>
        </div>
    );
}
