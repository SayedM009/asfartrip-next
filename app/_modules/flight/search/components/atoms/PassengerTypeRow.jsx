import { cn } from "@/lib/utils";

/**
 * PassengerTypeRow - Atomic Component
 * Displays a single passenger type with icon and description
 * 
 * @param {React.Component} icon - Icon component to display
 * @param {string} label - Passenger type label (e.g., "Adults")
 * @param {string} description - Age range description (e.g., "12+ years")
 * @param {React.ReactNode} children - Counter component or other controls
 */
export default function PassengerTypeRow({ icon: Icon, label, description, children }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                </div>
            </div>
            {children}
        </div>
    );
}
