"use client";
import { Link } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";

function Logo() {
  const { theme } = useTheme();
  const condition = theme === "dark";
  return (
    <Link href="/">
      <Image
        src={condition ? "/lightLogo.webp" : "/logo.png"}
        width={100}
        height={30}
        priority
        fetchPriority="high"
        loading="eager"
        alt="logo"
      />
    </Link>
  );
}

export default Logo;
