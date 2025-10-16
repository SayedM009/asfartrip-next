"use client";
import React, { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Mock saved travelers with complete data
const savedTravelers = [
    {
        id: "1",
        title: "mr",
        firstName: "AHMED",
        lastName: "MOHAMED",
        dateOfBirth: new Date("1990-05-15"),
        passportNumber: "A12345678",
        passportExpiry: new Date("2028-12-31"),
        nationality: "AE", // United Arab Emirates
    },
    {
        id: "2",
        title: "mrs",
        firstName: "FATIMA",
        lastName: "SALEM",
        dateOfBirth: new Date("1992-08-20"),
        passportNumber: "B98765432",
        passportExpiry: new Date("2029-06-30"),
        nationality: "SA", // Saudi Arabia
    },
    {
        id: "3",
        title: "miss",
        firstName: "LAYLA",
        lastName: "HASSAN",
        dateOfBirth: new Date("1995-03-10"),
        passportNumber: "C11223344",
        passportExpiry: new Date("2027-09-15"),
        nationality: "EG", // Egypt
    },
];

export function SavedTravelerSelect({ onSelect }) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const t = useTranslations("Traveler");
    const selectedTraveler = savedTravelers.find((t) => t.id === selectedId);

    const handleSelect = (travelerId) => {
        const traveler = savedTravelers.find((t) => t.id === travelerId);
        if (traveler) {
            setSelectedId(travelerId);
            // Send complete traveler data
            onSelect?.({
                title: traveler.title,
                firstName: traveler.firstName,
                lastName: traveler.lastName,
                dateOfBirth: traveler.dateOfBirth,
                passportNumber: traveler.passportNumber,
                passportExpiry: traveler.passportExpiry,
                nationality: traveler.nationality,
            });
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2 w-full sm:w-fit">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-12 cursor-pointer"
                    >
                        {selectedTraveler ? (
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {selectedTraveler.firstName}{" "}
                                {selectedTraveler.lastName}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                {t("saved_travelers")}
                            </span>
                        )}
                        <ChevronsUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search travelers..." />
                        <CommandList>
                            <CommandEmpty>
                                {t("no_saved_travelers")}
                            </CommandEmpty>
                            <CommandGroup>
                                {savedTravelers.map((traveler) => (
                                    <CommandItem
                                        key={traveler.id}
                                        value={`${traveler.firstName} ${traveler.lastName}`}
                                        onSelect={() =>
                                            handleSelect(traveler.id)
                                        }
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "ltr:mr-2 rtl:ml-2 h-4 w-4",
                                                selectedId === traveler.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium capitalize">
                                                    {traveler.title}{" "}
                                                    {traveler.firstName}{" "}
                                                    {traveler.lastName}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Passport:{" "}
                                                {traveler.passportNumber}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export { savedTravelers };
