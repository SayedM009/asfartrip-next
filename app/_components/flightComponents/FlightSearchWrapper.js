import useIsDevice from "../../_hooks/useIsDevice";
import { FlightSearchFormDesktop } from "./flightSearchFormDesktop/FlightSearchFromDesktop";
import { FlightSearchForm } from "./flightSearchFormMobile/FlightSearchFormMobile";

function FlightSearchWrapper() {
    const { mobile } = useIsDevice();
    return <>{mobile ? <FlightSearchForm /> : <FlightSearchFormDesktop />}</>;
}

export default FlightSearchWrapper;
