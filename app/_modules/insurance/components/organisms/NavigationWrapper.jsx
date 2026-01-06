import { getIsDevice } from "@/app/_hooks/useIsDevice";
import MobileHeaderWrapper from "./MobileHeaderWrapper";
import DesktopHeaderWrapper from "./DesktopHeaderWrapper";

async function NavigationWrapper() {
    const { mobile } = await getIsDevice();
    return <>{mobile ? <MobileHeaderWrapper /> : <DesktopHeaderWrapper />}</>;
}

export default NavigationWrapper;
