"use client";
import useBookingStore from "../../store/bookingStore";
import BaggageDialog from "../organism/BaggageDialog";
// import MealsDialog from "./MealsDialog";
import { useTranslations } from "next-intl";

function AddOn() {
    const t = useTranslations("Flight");
    const { baggageData, ticket: bookingTicket } = useBookingStore();
    // const bookingTicket = useBookingStore((state) => state.ticket);

    if (!baggageData?.outward?.length && !baggageData?.return?.length)
        return null;
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
