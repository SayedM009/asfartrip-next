import useIsDevice from "@/app/_hooks/useIsDevice";
import { FlightSearchFormDesktop } from "./desktop/FlightSearchFromDesktop";
import { FlightSearchForm as FlightSearchFormMobile } from "./mobile/FlightSearchFormMobile";

export default function FlightSearchWrapper() {
    const { mobile } = useIsDevice();

    return mobile ? <FlightSearchFormMobile /> : <FlightSearchFormDesktop />;
}
