import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PassengerClassPicker } from "../PassengerClassPicker";

/**
 * PassengerClassDialog - Organism Component
 * Mobile dialog for passenger and class selection
 * Uses the PassengerClassPicker organism internally
 * 
 * @param {boolean} open - Whether dialog is open
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {Object} passengers - Current passenger counts
 * @param {function} setPassengers - Set passengers function
 * @param {string} travelClass - Current travel class
 * @param {function} setTravelClass - Set travel class function
 */
export default function PassengerClassDialog({
    open,
    onOpenChange,
    passengers,
    setPassengers,
    travelClass,
    setTravelClass,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Passengers & Class
                    </DialogTitle>
                </DialogHeader>
                <PassengerClassPicker
                    passengers={passengers}
                    setPassengers={setPassengers}
                    travelClass={travelClass}
                    setTravelClass={setTravelClass}
                    showLabel={false}
                />
            </DialogContent>
        </Dialog>
    );
}
