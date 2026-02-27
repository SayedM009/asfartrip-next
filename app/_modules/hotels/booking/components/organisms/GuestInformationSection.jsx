"use client";

import { User, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CountryCodeSelect from "@/app/_modules/flight/booking/components/atoms/CountryCodeSelect";
import { NationalitySelect } from "@/app/_modules/flight/booking/components/molecule/NationalitySelect";

const SALUTATIONS = ["Mr", "Mrs", "Ms"];

/**
 * Guest information section — lead guest (full) + other guests (name only)
 */
export default function GuestInformationSection({
    leadGuest,
    otherGuests,
    updateLeadGuest,
    updateOtherGuest,
    getLeadErrors,
    getOtherGuestErrors,
}) {
    const t = useTranslations("Hotels.booking");
    const leadErrors = getLeadErrors();

    return (
        <div className="space-y-6">
            {/* Lead Guest */}
            <div className="rounded-2xl border border-border bg-white dark:bg-gray-800/50 p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                        <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{t("lead_guest")}</h3>
                        <p className="text-sm text-muted-foreground">{t("lead_guest_desc")}</p>
                    </div>
                </div>

                {/* Salutation + Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("salutation")}</label>
                        <Select
                            value={leadGuest.salutation || undefined}
                            onValueChange={(val) => updateLeadGuest({ salutation: val })}
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-full h-14 cursor-pointer py-5",
                                    leadErrors.salutation && "border-red-500"
                                )}
                            >
                                <SelectValue placeholder={t("select")} />
                            </SelectTrigger>
                            <SelectContent>
                                {SALUTATIONS.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("first_name")}</label>
                        <input
                            type="text"
                            value={leadGuest.firstName}
                            onChange={(e) => updateLeadGuest({ firstName: e.target.value })}
                            placeholder={t("first_name")}
                            className={cn(
                                "w-full rounded-lg border px-3 py-2.5 text-sm bg-background",
                                leadErrors.firstName ? "border-red-500" : "border-border"
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("last_name")}</label>
                        <input
                            type="text"
                            value={leadGuest.lastName}
                            onChange={(e) => updateLeadGuest({ lastName: e.target.value })}
                            placeholder={t("last_name")}
                            className={cn(
                                "w-full rounded-lg border px-3 py-2.5 text-sm bg-background",
                                leadErrors.lastName ? "border-red-500" : "border-border"
                            )}
                        />
                    </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("email")}</label>
                        <input
                            type="email"
                            value={leadGuest.email}
                            onChange={(e) => updateLeadGuest({ email: e.target.value })}
                            placeholder={t("email_placeholder")}
                            className={cn(
                                "w-full rounded-lg border px-3 py-2.5 text-sm bg-background",
                                leadErrors.email ? "border-red-500" : "border-border"
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("phone_number")}</label>
                        <div className="flex gap-2">
                            <CountryCodeSelect
                                value={leadGuest.phoneCode || "+971"}
                                onValueChange={(code) => updateLeadGuest({ phoneCode: code })}
                            />
                            <input
                                type="tel"
                                value={leadGuest.phoneNumber}
                                onChange={(e) => updateLeadGuest({ phoneNumber: e.target.value })}
                                placeholder={t("phone_placeholder")}
                                className={cn(
                                    "flex-1 rounded-lg border px-3 py-2.5 text-sm bg-background",
                                    leadErrors.phoneNumber ? "border-red-500" : "border-border"
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Address + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("address")}</label>
                        <input
                            type="text"
                            value={leadGuest.address}
                            onChange={(e) => updateLeadGuest({ address: e.target.value })}
                            placeholder={t("address_placeholder")}
                            className={cn(
                                "w-full rounded-lg border px-3 py-2.5 text-sm bg-background",
                                leadErrors.address ? "border-red-500" : "border-border"
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">{t("country")}</label>
                        <NationalitySelect
                            value={leadGuest.countryCode}
                            onValueChange={(code) => updateLeadGuest({ countryCode: code })}
                        />
                        {leadErrors.countryCode && (
                            <div className="mt-1 h-0.5 bg-red-500 rounded" />
                        )}
                    </div>
                </div>
            </div>

            {/* Other Guests */}
            {otherGuests.length > 0 && (
                <div className="rounded-2xl border border-border bg-white dark:bg-gray-800/50 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900">
                                <Users className="w-5 h-5 text-accent-600" />
                            </div>
                            <h3 className="font-semibold text-lg">{t("other_guests")}</h3>
                        </div>
                        <Badge variant="outline">
                            {String(otherGuests.length).padStart(2, "0")} {t("guests")}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        {otherGuests.map((guest, index) => {
                            const errors = getOtherGuestErrors(index);
                            return (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border/50 bg-background/50 p-4 space-y-3"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                            variant="secondary"
                                            className="capitalize text-xs"
                                        >
                                            {guest.type === "adult" ? t("adult") : t("child")} {index + 1}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">{t("salutation")}</label>
                                            <Select
                                                value={guest.salutation || undefined}
                                                onValueChange={(val) =>
                                                    updateOtherGuest(index, { salutation: val })
                                                }
                                            >
                                                <SelectTrigger
                                                    className={cn(
                                                        "w-full h-10 cursor-pointer",
                                                        errors.salutation && "border-red-500"
                                                    )}
                                                >
                                                    <SelectValue placeholder={t("select")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SALUTATIONS.map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">{t("first_name")}</label>
                                            <input
                                                type="text"
                                                value={guest.firstName}
                                                onChange={(e) =>
                                                    updateOtherGuest(index, { firstName: e.target.value })
                                                }
                                                placeholder={t("first_name")}
                                                className={cn(
                                                    "w-full rounded-lg border px-3 py-2 text-sm bg-background",
                                                    errors.firstName ? "border-red-500" : "border-border"
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">{t("last_name")}</label>
                                            <input
                                                type="text"
                                                value={guest.lastName}
                                                onChange={(e) =>
                                                    updateOtherGuest(index, { lastName: e.target.value })
                                                }
                                                placeholder={t("last_name")}
                                                className={cn(
                                                    "w-full rounded-lg border px-3 py-2 text-sm bg-background",
                                                    errors.lastName ? "border-red-500" : "border-border"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
