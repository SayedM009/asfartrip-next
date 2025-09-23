"use client";

import { useEffect, useState } from "react";
import MobileDetect from "mobile-detect";

function useIsDeviceClient() {
    const [device, setDevice] = useState({ mobile: false, tablet: false });

    useEffect(() => {
        const ua = navigator.userAgent;
        const md = new MobileDetect(ua);

        setDevice({
            mobile: !!md.mobile(),
            tablet: !!md.tablet(),
        });
    }, []);

    return device;
}

export default useIsDeviceClient;
