import { FlightSearchFormDesktop } from "../flightSearchFormDesktop/FlightSearchFromDesktop";
import Navbar from "@/app/_components/Navbar";
import MobileWrapper from "./MobileWrapper";
import useIsDevice from "@/app/_hooks/useIsDevice";

function FlightSearchNavWrapper({ tickets }) {
    const { mobile } = useIsDevice();
    return (
        <>{mobile ? <MobileWrapper tickets={tickets} /> : <DesktopWrapper />}</>
    );
}

function DesktopWrapper() {
    return (
        <>
            <Navbar />
            <div className="mt-5">
                <FlightSearchFormDesktop isLabel={false} />
            </div>
        </>
    );
}

export default FlightSearchNavWrapper;
