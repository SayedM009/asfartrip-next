// import useIsDevice from "@/app/_hooks/useIsDevice";
import MobileHeaderWrapper from "./MobileHeaderWrapper";
import { FlightSearchFormDesktop } from "../../../search/components/desktop/FlightSearchFromDesktop";
import { getIsDevice } from "@/app/_hooks/useIsDevice";

async function FlightSearchWrapper() {
    // const { mobile } = useIsDevice();
    const { mobile } = await getIsDevice();
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
