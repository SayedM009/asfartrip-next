import { cn } from "@/lib/utils";

/**
 * TripTypeButton - Atomic Component
 * A single button for trip type selection
 * 
 * @param {string} type - Trip type value ('oneway' or 'roundtrip')
 * @param {boolean} isActive - Whether this button is currently selected
 * @param {function} onClick - Click handler
 * @param {string} label - Button label text
 */
export default function TripTypeButton({ type, isActive, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 font-medium transition-colors duration-200 rounded-md relative z-10 cursor-pointer",
                isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
            )}
            aria-pressed={isActive}
            aria-label={label}
        >
            {label}
        </button>
    );
}
