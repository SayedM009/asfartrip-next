import { BackWardButtonWithDirections } from "@/app/_components/navigation/BackwardButton";
import ResearchDialog from "../molecules/ResearchDialog";
import CurrencySwitcher from "@/app/_modules/currency/components/organisms/CurrencySwitcher";

export default function MobileHeaderWrapper() {
    return (
        <div className="flex items-center justify-between gap-2 mb-2">
            <BackWardButtonWithDirections href="/insurance" />
            <ResearchDialog />
            <div>
                <CurrencySwitcher isLabel={false} />
            </div>
        </div>
    );
}
