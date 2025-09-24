import Navbar from "@/app/_components/Navbar";
import { FlightSearchFormDesktop } from "../flightSearchFormDesktop/FlightSearchFromDesktop";
export default function DesktopHeaderWrapper() {
    return (
        <>
            <Navbar />
            <div className="mt-5">
                <FlightSearchFormDesktop isLabel={false} />
            </div>
        </>
    );
}
