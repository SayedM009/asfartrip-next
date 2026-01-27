"use client";

import { Building2, Home, Castle, Hotel } from "lucide-react";

const PROPERTY_ICONS = {
    Hotel: Hotel,
    Apartment: Home,
    Resort: Castle,
    Villa: Home,
    default: Building2,
};

/**
 * Property type badge component
 * @param {Object} props
 * @param {string} props.type - Property type
 */
export default function PropertyTypeBadge({ type }) {
    if (!type) return null;

    const Icon = PROPERTY_ICONS[type] || PROPERTY_ICONS.default;

    return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            <Icon className="size-3" />
            <span>{type}</span>
        </div>
    );
}
