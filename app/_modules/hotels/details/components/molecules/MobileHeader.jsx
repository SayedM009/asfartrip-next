"use client";

import { Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

/**
 * Mobile header with back button and actions
 */
export default function MobileHeader({ hotelName, resultsUrl }) {
    const handleShare = async () => {
        const shareData = {
            title: hotelName,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.log("Copy failed");
            }
        }
    };

    return (
        <div className="flex items-center justify-between px-2 py-3 absolute top-0 left-0 right-0 z-10">
            <Link
                href={resultsUrl || "/hotels"}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 text-foreground"
            >
                <span className="rotate-180 flex">
                    <ChevronBasedOnLanguage icon="arrow" size="5" />
                </span>
            </Link>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="cursor-pointer bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 rounded-full w-8 h-8"
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
