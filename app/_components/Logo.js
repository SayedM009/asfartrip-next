"use client";
import { Link } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

function Logo() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted
        ? theme === "light"
            ? "/logo.webp"
            : "/lightLogo.webp"
        : "/logo.webp";

    return (
        <Link href="/">
            <Image
                src={logoSrc}
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
