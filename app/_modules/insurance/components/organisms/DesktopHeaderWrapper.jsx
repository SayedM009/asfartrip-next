import Navbar from "@/app/_components/navigation/Navbar";
import { InsuranceSearchForm } from "../templates";

function DesktopHeaderWrapper() {
    return (
        <>
            <Navbar />
            <div className=" mt-6">
                <InsuranceSearchForm />
            </div>
        </>
    );
}

export default DesktopHeaderWrapper;
