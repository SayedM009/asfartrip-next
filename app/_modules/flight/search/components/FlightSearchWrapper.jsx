// import useIsDevice from "@/app/_hooks/useIsDevice";
import { FlightSearchFormDesktop } from "./desktop/FlightSearchFromDesktop";
import { FlightSearchForm as FlightSearchFormMobile } from "./mobile/FlightSearchFormMobile";
import { getIsDevice } from "@/app/_hooks/useIsDevice";

export default async function FlightSearchWrapper() {
    const { mobile } = await getIsDevice();

    return mobile ? <FlightSearchFormMobile /> : <FlightSearchFormDesktop />;
}
