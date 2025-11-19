"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getNewLocalePath } from "../utils/getNewLocalePath";

export function useLanguage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function switchLang(locale) {
        const finalPath = getNewLocalePath(pathname, searchParams, locale);
        router.push(finalPath);
    }

    return { switchLang, pathname };
}
