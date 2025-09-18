import useIsDevice from "@/app/_hooks/useIsDevice";
import BottomAppBar from "./BottomAppBar";
function BottomAppWrapper() {
    const { mobile } = useIsDevice();
    return <>{mobile && <BottomAppBar />}</>;
}

export default BottomAppWrapper;
