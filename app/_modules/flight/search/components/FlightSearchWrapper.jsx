// import useIsDevice from "@/app/_hooks/useIsDevice";
import { FlightSearchFormDesktop } from "./desktop/FlightSearchFromDesktop";
import WegoSearchForm from "./mobile-wego/WegoSearchForm";
import { FlightSearchForm as FlightSearchFormMobile } from "./mobile/FlightSearchFormMobile";
import { getIsDevice } from "@/app/_hooks/useIsDevice";

export default async function FlightSearchWrapper() {
    const { mobile } = await getIsDevice();

    return mobile ? <WegoSearchForm /> : <FlightSearchFormDesktop />;
}
