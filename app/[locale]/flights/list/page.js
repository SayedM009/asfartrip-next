import Navbar from "@/app/_components/Navbar";
import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import useIsDevice from "@/app/_hooks/useIsDevice";

function Page() {
    const { mobile } = useIsDevice();
    return (
        <>
            {/* Hidding navbar on mobile */}
            {!mobile && <Navbar />}
            <div className="container-custom">list</div>
            <BottomAppBar />
        </>
    );
}

export default Page;
