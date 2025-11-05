import React, { useState } from "react";
import { UtensilsCrossed, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import useBookingStore from "@/app/_store/bookingStore";

const availableMeals = [
    { id: "none", name: "No Meal", description: "Skip meal service", price: 0 },
    {
        id: "veg",
        name: "Vegetarian Meal",
        description: "Fresh vegetarian options",
        price: 15,
    },
    {
        id: "chicken",
        name: "Chicken Meal",
        description: "Grilled chicken with sides",
        price: 18,
    },
    {
        id: "beef",
        name: "Beef Meal",
        description: "Tender beef with vegetables",
        price: 20,
    },
    {
        id: "fish",
        name: "Fish Meal",
        description: "Fresh fish with rice",
        price: 19,
    },
    {
        id: "special",
        name: "Special Diet",
        description: "Gluten-free, Halal, Kosher",
        price: 17,
    },
];

export default function MealsDialog({
    selectedMeal: initialMeal,
    onMealChange,
}) {
    const [selectedMeal, setSelectedMeal] = useState(initialMeal ?? "none");

    const [open, setOpen] = useState(false);

    const f = useTranslations("Flight");
    const selectedMealData = availableMeals.find((m) => m.id === selectedMeal);
    const totalCost = selectedMealData?.price || 0;
    const updateMeal = useBookingStore((state) => state.updateMeal);

    const handleSave = () => {
        onMealChange?.(selectedMeal, totalCost);
        updateMeal(selectedMeal, totalCost);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between h-14 px-5"
                >
                    <span className="flex items-center gap-3">
                        <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
                            <UtensilsCrossed className="size-5 text-accent-600" />
                        </div>
                        <span>
                            {selectedMeal !== "none"
                                ? selectedMealData?.name
                                : f("booking.add_meal")}
                        </span>
                    </span>
                    {totalCost > 0 && (
                        <span className="text-blue-600">+{totalCost} AED</span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-full sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                        <UtensilsCrossed className="w-5 h-5" />
                        Select Meal
                    </DialogTitle>
                    <DialogDescription className="rtl:text-right">
                        Choose your preferred in-flight meal
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Meal Options */}
                    <div className="space-y-3">
                        {availableMeals.map((meal) => {
                            const isSelected = selectedMeal === meal.id;
                            return (
                                <button
                                    key={meal.id}
                                    onClick={() => setSelectedMeal(meal.id)}
                                    className={cn(
                                        "w-full p-4 rounded-lg border-2 transition-all text-left rtl:text-right",
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3 rtl:flex-row-reverse">
                                        <div className="flex items-center gap-3 rtl:flex-row-reverse rtl:justify-end flex-1">
                                            <div
                                                className={cn(
                                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0",
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-500"
                                                        : "border-gray-300 dark:border-gray-600"
                                                )}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <div className="rtl:text-right flex-1">
                                                <div className="text-sm mb-1">
                                                    {meal.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {meal.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm rtl:text-left">
                                            {meal.price > 0
                                                ? `${meal.price} AED`
                                                : "Free"}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Save Selection
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
