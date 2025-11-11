import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

import PersonalInfo from "./PersonalInfo";
import Travellers from "./travellers/Travellers";
import FlightBookings from "./bookings/FlightBookings";
import HotelBookings from "./bookings/HotelBookings";
import InsuranceBookings from "./bookings/InsuranceBookings";

export default function FullscreenDialog({ openDialog, setOpenDialog }) {
    const p = useTranslations("Profile");
    return (
        <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
            <DialogContent
                className={`max-w-none h-screen bg-white dark:bg-[#111] p-4 overflow-y-auto rounded-none open-slide-left close-slide-left `}
            >
                <DialogHeader className="flex flex-row h-fit">
                    <DialogTitle className="text-lg font-semibold">
                        {openDialog && p(`${openDialog}`)}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {renderDialogBody(openDialog, () => setOpenDialog(null))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function renderDialogBody(type, closeDialog) {
    switch (type) {
        case "personal_info":
            return <PersonalInfo close={closeDialog} />;
        case "add_edit_travelers":
            return <Travellers />;
        case "flight_bookings":
            return <FlightBookings />;
        case "hotel_bookings":
            return <HotelBookings />;
        case "insurance_bookings":
            return <InsuranceBookings />;

        default:
            return <p className="text-sm text-gray-500">Content for {type}.</p>;
    }
}
