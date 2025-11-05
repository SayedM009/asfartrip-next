import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function SwapButton({ callBack }) {
    const [spinning, setSpinning] = useState(false);
    function handleSwap() {
        callBack();
        setSpinning(true);
        setTimeout(() => setSpinning(false), 1000);
    }
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            className="mx-3 h-8 w-8 rounded-full hover:bg-blue-50 border-1 border-gray-300 relative cursor-pointer"
            aria-label="Switch destination values"
        >
            <RefreshCcw
                className={`cursor-pointer  transition-transform ${
                    spinning ? "animate-spin duration-75" : ""
                }`}
            />
        </Button>
    );
}

export default SwapButton;
