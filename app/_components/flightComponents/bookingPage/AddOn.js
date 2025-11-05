import useBookingStore from "@/app/_store/bookingStore";
import BaggageDialog from "./BaggageDialog";
import MealsDialog from "./MealsDialog";
import { useTranslations } from "next-intl";

function AddOn() {
    const bookingTicket = useBookingStore((state) => state.ticket);
    const t = useTranslations("Flight");
    const { baggageData } = useBookingStore();
    if (!baggageData?.outbound && !baggageData?.inbound) return null;
    return (
        <>
            <h2 className="mb-4 rtl:text-right font-semibold text-xl ">
                {t("booking.add_on")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaggageDialog
                    cabinLuggage={bookingTicket.CabinLuggage}
                    includedBaggage={bookingTicket.BaggageAllowance}
                />
                {/* <MealsDialog /> */}
            </div>
        </>
    );
}

export default AddOn;
