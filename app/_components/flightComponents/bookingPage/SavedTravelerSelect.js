"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { useTranslations } from "next-intl";
import { parseISO, isBefore } from "date-fns";
import useTravellersStore from "@/app/_store/travellersStore";
import useAuthStore from "@/app/_modules/auth/store/authStore";

export function SavedTravelerSelect({ onSelect }) {
    const t = useTranslations("Traveler");
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { travellers } = useTravellersStore();
    const { session } = useAuthStore();
    const userData = session?.fullData?.user;

    const mappedTravellers = travellers
        .map((traveller) => {
            const data = JSON.parse(traveller.json_list || "{}");
            const {
                title = "",
                first_name = "",
                last_name = "",
                dob = "",
                passport_country = "",
                passport_expiry = "",
                passport_no = "",
            } = data;

            return {
                id: `traveller-${traveller.id}`,
                title,
                firstName: first_name,
                lastName: last_name,
                dateOfBirth: dob,
                passportNumber: passport_no,
                passportExpiry: passport_expiry,
                nationality: passport_country,
            };
        })
        .filter((traveler) => {
            if (!traveler.passportExpiry) return true;
            const expiry = parseISO(traveler.passportExpiry);
            return expiry && !isBefore(expiry, new Date());
        });

    const currentUserTraveler = userData
        ? {
              id: `user-${userData.user_id}`,
              title: userData.title || "Mr",
              firstName: userData.firstname || "",
              lastName: userData.lastname || "",
              dateOfBirth: userData.dob || "",
              passportNumber: userData.middlename || "", // أو أي حقل يحتوي رقم الجواز
              passportExpiry: userData.passport_expiry || "",
              nationality: userData.country_code || "",
              isPrimary: true, // عشان نقدر نميز المستخدم نفسه
          }
        : null;

    const allTravelers = useMemo(() => {
        const list = mappedTravellers ? [...mappedTravellers] : [];
        if (currentUserTraveler) {
            const alreadyExists = list.some(
                (t) =>
                    t.firstName === currentUserTraveler.firstName &&
                    t.lastName === currentUserTraveler.lastName
            );
            if (!alreadyExists) list.unshift(currentUserTraveler);
        }
        return list;
    }, [mappedTravellers, currentUserTraveler]);

    const selectedTraveler = allTravelers.find((t) => t.id === selectedId);

    const handleSelect = (travelerId) => {
        const traveler = allTravelers.find((t) => t.id === travelerId);
        if (traveler) {
            setSelectedId(travelerId);
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
                        <ChevronsUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className=" p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search travelers..." />
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
                                            handleSelect(traveler.id)
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
