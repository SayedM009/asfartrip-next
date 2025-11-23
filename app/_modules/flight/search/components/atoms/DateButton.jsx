import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * DateButton - Atomic Component
 * A button that displays a date and opens a date picker
 * 
 * @param {string} label - Button label text
 * @param {string} formattedDate - Formatted date string to display
 * @param {string} placeholder - Placeholder when no date selected
 * @param {boolean} isActive - Whether the button is in active state
 */
const DateButton = forwardRef(({ 
    label, 
    formattedDate, 
    placeholder,
    isActive = false,
    ...props
}, ref) => {
    return (
        <Button
            ref={ref}
            variant="outline"
            className={cn(
                "h-12 w-full justify-start bg-input-background border-0 cursor-pointer",
                isActive && "ring-2 ring-primary"
            )}
            aria-label={label}
            {...props}
        >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
                {formattedDate || placeholder}
            </span>
        </Button>
    );
});

DateButton.displayName = "DateButton";

export default DateButton;
