"use client";
import { Loader2 } from "lucide-react";

export default function LoadingState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-600 dark:text-gray-300">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
            <p>{message || "Loading..."}</p>
        </div>
    );
}
