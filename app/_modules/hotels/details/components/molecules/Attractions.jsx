"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Hotel,
    LandPlot,
    MapPinHouse,
    Plane,
    ShoppingBag,
    TrainFront,
    University,
    Waves,
} from "lucide-react";

export default function Attractions({ data }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    if (!data || !data[0]) return null;

    const allItems = data[0]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => {
            if (!item) return false;
            const lower = item.toLowerCase();

            if (lower.includes("distances are displayed")) return false;
            if (lower.includes("preferred airport")) return false;
            if (lower.includes("nearest")) return false;
            return true;
        });

    const displayItems = allItems.slice(0, 6);
    const hasMore = allItems.length > 6;

    const getIcon = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes("airport")) return <Plane className="size-5" />;
        if (lower.includes("beach")) return <Waves className="size-5" />;
        if (lower.includes("mall")) return <ShoppingBag className="size-5" />;
        if (lower.includes("golf")) return <LandPlot className="size-5" />;
        if (lower.includes("metro")) return <TrainFront className="size-5" />;
        if (lower.includes("university"))
            return <University className="size-5" />;
        if (lower.includes("resort") || lower.includes("hotel"))
            return <Hotel className="size-5" />;
        return <MapPinHouse className="size-5" />;
    };

    // Reusable attraction item
    const AttractionItem = ({ item, index }) => (
        <li key={index} className="flex items-center gap-2">
            {getIcon(item)}
            <span>{item.replace(/\/\s*\d+(\.\d+)?\s*mi/g, "")}</span>
        </li>
    );

    return (
        <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Attractions</h2>
            <ul className="space-y-2 text-muted-foreground">
                {displayItems.map((item, index) => (
                    <AttractionItem key={index} item={item} index={index} />
                ))}
            </ul>

            {hasMore && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="px-0 hover:bg-transparent cursor-pointer text-blue-500 dark:hover:bg-transparent mt-2"
                        >
                            Show All {allItems.length} Attractions
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>
                                All Attractions ({allItems.length})
                            </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto max-h-[60vh] pr-2">
                            <ul className="space-y-3 text-muted-foreground">
                                {allItems.map((item, index) => (
                                    <AttractionItem
                                        key={index}
                                        item={item}
                                        index={index}
                                    />
                                ))}
                            </ul>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}
