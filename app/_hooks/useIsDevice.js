import MobileDetect from "mobile-detect";
import { headers } from "next/headers";
function useIsDevice() {
    const ua = headers().get("user-agent") || "";
    const md = new MobileDetect(ua);
    const mobile = md.mobile();
    const tablet = md.tablet();

    return { mobile, tablet };
}

export default useIsDevice;
