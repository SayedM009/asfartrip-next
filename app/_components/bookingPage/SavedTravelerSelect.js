import React, { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

// Mock saved travelers
const savedTravelers = [
    {
        id: "1",
        title: "mr",
        firstName: "AHMED",
        lastName: "MOHAMED",
        dateOfBirth: new Date(1990, 5, 15),
        passportNumber: "A12345678",
        nationality: "AE",
        passportExpiry: new Date(2028, 11, 31),
    },
    {
        id: "2",
        title: "mrs",
        firstName: "FATIMA",
        lastName: "SALEM",
        dateOfBirth: new Date(1992, 8, 22),
        passportNumber: "B98765432",
        nationality: "AE",
        passportExpiry: new Date(2027, 6, 15),
    },
];

export function SavedTravelerSelect({ onSelect }) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState();

    const selectedTraveler = savedTravelers.find((t) => t.id === selectedId);

    const handleSelect = (travelerId) => {
        const traveler = savedTravelers.find((t) => t.id === travelerId);
        if (traveler) {
            setSelectedId(travelerId);
            onSelect?.(traveler);
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2">
            <PopoverTrigger open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-12"
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
                                Select from saved travelers
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
                                No saved travelers found.
                            </CommandEmpty>
                            <CommandGroup>
                                {savedTravelers.map((traveler) => (
                                    <CommandItem
                                        key={traveler.id}
                                        value={`${traveler.firstName} ${traveler.lastName}`}
                                        onSelect={() =>
                                            handleSelect(traveler.id)
                                        }
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
                                                <span>
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
            </PopoverTrigger>
        </div>
    );
}

export { savedTravelers };
