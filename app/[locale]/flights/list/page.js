import MobileDetect from "mobile-detect";
import { headers } from "next/headers";
import Navbar from "@/app/_components/Navbar";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";

function page() {
    const ua = headers().get("user-agent") || "";
    const md = new MobileDetect(ua);
    return (
        <>
            {/* Hidding navbar on mobile */}
            {!md.mobile() && <Navbar />}
            <div className="container-custom">list</div>
            <BottomAppBar />
        </>
    );
}

export default page;
