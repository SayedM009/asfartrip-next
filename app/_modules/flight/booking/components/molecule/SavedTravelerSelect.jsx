"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { useTranslations } from "next-intl";
import { useSavedTravelers } from "../../hooks/useSavedTravelers";

export default function SavedTravelerSelect({ onSelect }) {
    const t = useTranslations("Traveler");

    const { open, setOpen, selectedId, allTravelers, selectTraveler } =
        useSavedTravelers();

    const selectedTraveler = allTravelers.find((t) => t.id === selectedId);

    return (
        <div className="space-y-2 w-full sm:w-fit">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between h-12"
                        role="combobox"
                        aria-expanded={open}
                    >
                        {selectedTraveler ? (
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {selectedTraveler.title}{" "}
                                {selectedTraveler.firstName}{" "}
                                {selectedTraveler.lastName}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                {t("saved_travelers")}
                            </span>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0" align="start">
                    <Command shouldFilter={true}>
                        <CommandInput
                            placeholder={t("search_travelers")}
                            autoFocus={false}
                        />

                        <CommandList>
                            <CommandEmpty>
                                {t("no_saved_travelers")}
                            </CommandEmpty>

                            <CommandGroup>
                                {allTravelers.map((traveler) => (
                                    <CommandItem
                                        key={traveler.id}
                                        value={`${traveler.firstName} ${traveler.lastName}`}
                                        onSelect={() =>
                                            selectTraveler(
                                                traveler.id,
                                                onSelect
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "ltr:mr-2 rtl:ml-2 h-4 w-4 text-accent-500",
                                                selectedId === traveler.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "font-medium",
                                                        traveler.isPrimary &&
                                                            "text-green-600"
                                                    )}
                                                >
                                                    {traveler.title}{" "}
                                                    {traveler.firstName}{" "}
                                                    {traveler.lastName}
                                                    {traveler.isPrimary && (
                                                        <span>
                                                            {" "}
                                                            ({t("you")})
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {t("passport")}:{" "}
                                                {traveler.passportNumber || "—"}
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
