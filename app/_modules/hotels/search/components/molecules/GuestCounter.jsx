"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

/**
 * Reusable counter component for rooms/adults/children
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {number} props.value - Current value
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {Function} props.onChange - Callback when value changes
 */
export default function GuestCounter({ label, value, min, max, onChange }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <Label className="text-sm font-bold">{label}</Label>
            <div className="flex items-center">
                <Button
                    variant="outline"
                    className="w-6 h-6 rounded-full cursor-pointer border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onChange(value - 1)}
                    disabled={value <= min}
                >
                    <Minus className="size-3" />
                </Button>
                <span className="w-10 text-center">{value}</span>
                <Button
                    variant="outline"
                    className="w-6 h-6 rounded-full cursor-pointer border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onChange(value + 1)}
                    disabled={value >= max}
                >
                    <Plus className="size-3" />
                </Button>
            </div>
        </div>
    );
}
