import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function UserAvatar({ user }) {
  return (
    <>
      {/* On mobile */}
      <Link href="/profile" className="block sm:hidden">
        <Avatar>
          <AvatarImage
            src={user.image ? user.image : "https://github.com/shadcn.png"}
          />

          <AvatarFallback>
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              referrerPolicy="no-referrer"
            />
          </AvatarFallback>
        </Avatar>
      </Link>
      {/* On Desktop */}
      <Avatar className="hidden sm:block">
        <AvatarImage
          src={user.image ? user.image : "https://github.com/shadcn.png"}
        />

        <AvatarFallback>
          <Image
            src={user.image}
            alt={user.name}
            width={36}
            height={36}
            referrerPolicy="no-referrer"
          />
        </AvatarFallback>
      </Avatar>
    </>
  );
}
