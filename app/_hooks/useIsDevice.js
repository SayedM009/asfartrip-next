import MobileDetect from "mobile-detect";
import { headers } from "next/headers";

export async function getIsDevice() {
    const h = await headers();
    const ua = h.get("user-agent") || "";

    const md = new MobileDetect(ua);
    return {
        mobile: md.mobile(),
        tablet: md.tablet(),
    };
}
