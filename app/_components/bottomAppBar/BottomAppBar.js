"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { PercentBadgeIcon } from "@heroicons/react/24/outline";
import { HomeIcon, TicketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import MoreButton from "./MoreButton";

function BottomAppBar() {
  const pathname = usePathname();
  const t = useTranslations("Homepage");
  const HOME_PAGE_LINKS = [
    {
      title: "home",
      path: "/",
      icon: (active) => (
        <HomeIcon className={`w-7 ${active && "text-accent-400"}`} />
      ),
    },
    {
      title: "trips",
      path: "/trips",
      icon: (active) => (
        <TicketIcon className={`w-7 ${active && "text-accent-400"}`} />
      ),
    },
    {
      title: "offers",
      path: "/offers",
      icon: (active) => (
        <PercentBadgeIcon className={`w-6 ${active && "text-accent-400"}`} />
      ),
    },
  ];
  return (
    <footer className=" fixed w-full bottom-0 px-4 flex justify-around shadow-3xl border-t-2 border-gray-100">
      {HOME_PAGE_LINKS.map((link) => (
        <Link
          href={link.path}
          key={link.title}
          className={`${
            pathname === link.path && "border-t-2  border-accent-400"
          } pt-2 w-1/12 flex flex-col items-center`}
        >
          {link.icon(pathname === link.path)}
          <span
            className={`text-[11px] mt-.5 font-bold capitalize ${
              pathname === link.path && "text-accent-400"
            }`}
          >
            {t(`${link.title}`)}
          </span>
        </Link>
      ))}
      <MoreButton />
    </footer>
  );
}

export default BottomAppBar;
