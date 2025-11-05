import DesktopHeaderWrapper from "./DesktopHeaderWrapper";
import useIsDevice from "@/app/_hooks/useIsDevice";
import MobileHeaderWrapper from "./MobileHeaderWrapper";

function FlightSearchNavWrapper() {
    const { mobile } = useIsDevice();
    return <>{mobile ? <MobileHeaderWrapper /> : <DesktopHeaderWrapper />}</>;
}

export default FlightSearchNavWrapper;
