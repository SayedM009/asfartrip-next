import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PassengerCounter - Atomic Component
 * A counter component for incrementing/decrementing passenger count
 * 
 * @param {number} value - Current count value
 * @param {function} onIncrement - Function to call when incrementing
 * @param {function} onDecrement - Function to call when decrementing
 * @param {boolean} canIncrement - Whether increment is allowed
 * @param {boolean} canDecrement - Whether decrement is allowed
 * @param {string} label - Aria label for accessibility
 */
export default function PassengerCounter({
    value,
    onIncrement,
    onDecrement,
    canIncrement = true,
    canDecrement = true,
    label = "Passenger count"
}) {
    return (
        <div className="flex items-center space-x-2" role="group" aria-label={label}>
            <Button
                variant="outline"
                size="icon"
                onClick={onDecrement}
                disabled={!canDecrement}
                className={cn(
                    "h-8 w-8 cursor-pointer",
                    !canDecrement && "opacity-50 cursor-not-allowed"
                )}
                aria-label={`Decrease ${label}`}
            >
                <Minus className="h-3 w-3" />
            </Button>
            
            <span 
                className="w-8 text-center font-medium"
                aria-live="polite"
                aria-atomic="true"
            >
                {value}
            </span>
            
            <Button
                variant="outline"
                size="icon"
                onClick={onIncrement}
                disabled={!canIncrement}
                className={cn(
                    "h-8 w-8 cursor-pointer",
                    !canIncrement && "opacity-50 cursor-not-allowed"
                )}
                aria-label={`Increase ${label}`}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    );
}
