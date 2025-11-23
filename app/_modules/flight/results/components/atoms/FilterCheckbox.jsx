// app/_modules/flights/results/filters/components/FilterCheckbox.jsx

"use client";

import { Checkbox } from "@/components/ui/checkbox";

export default function FilterCheckbox({ label, checked, onChange }) {
    return (
        <label
            className="flex items-center gap-3 text-sm cursor-pointer 
        hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded justify-between"
        >
            <Checkbox
                checked={checked}
                onCheckedChange={onChange}
                className="data-[state=checked]:bg-accent-500 
                data-[state=checked]:border-accent-500 border-accent-500 
                dark:data-[state=checked]:bg-accent-500 cursor-pointer"
            />
            <span className="flex-1">{label}</span>
        </label>
    );
}
