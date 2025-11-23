import useIsDevice from "@/app/_hooks/useIsDevice";
import MobileHeaderWrapper from "./MobileHeaderWrapper";
import { FlightSearchFormDesktop } from "../../../search/components/desktop/FlightSearchFromDesktop";

function FlightSearchWrapper() {
    const { mobile } = useIsDevice();
    return (
        <>
            {mobile ? (
                <MobileHeaderWrapper />
            ) : (
                <div className="mt-5">
                    <FlightSearchFormDesktop isLabel={false} />
                </div>
            )}
        </>
    );
}

export default FlightSearchWrapper;
