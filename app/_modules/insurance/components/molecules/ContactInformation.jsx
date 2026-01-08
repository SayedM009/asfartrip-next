"use client";

import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import CountryCodeSelect from "@/app/_modules/flight/booking/components/atoms/CountryCodeSelect";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Label } from "@radix-ui/react-label";
import { useInsuranceContactInfo } from "../../hooks/useInsuranceContactInfo";
import { forwardRef, useImperativeHandle } from "react";

const ContactInformation = forwardRef(({ data, onDataChange }, ref) => {
    const t = useTranslations("Traveler");

    const { errors, showValidation, setField, triggerValidation } =
        useInsuranceContactInfo(data, onDataChange);

    // Expose triggerValidation to parent
    useImperativeHandle(ref, () => ({
        triggerValidation,
        getData: () => data,
    }));

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800/50 rounded-lg border-2 shadow-sm p-6 transition-colors",
                showValidation && Object.keys(errors || {}).length > 0
                    ? "border-red-500"
                    : "border-border"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                    </div>
                    <h3 className="font-semibold">
                        {t("contact_information")}
                    </h3>
                </div>

                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                    <Label className="text-xs cursor-pointer whitespace-nowrap">
                        {t("some_one_else")}
                    </Label>

                    <Switch
                        checked={!!data.bookingForSomeoneElse}
                        dir="ltr"
                        onCheckedChange={(v) =>
                            setField("bookingForSomeoneElse", v)
                        }
                        className="bg-accent-500"
                    />
                </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Booker Name */}
                {data.bookingForSomeoneElse && (
                    <div>
                        <Label>
                            {t("full_name")}{" "}
                            <span className="text-red-500">*</span>
                        </Label>

                        <Input
                            value={data.bookerName || ""}
                            onChange={(e) =>
                                setField(
                                    "bookerName",
                                    e.target.value.toUpperCase()
                                )
                            }
                            placeholder={t("full_name_placeholder")}
                            className={cn(
                                "mt-2 h-12",
                                showValidation &&
                                    errors?.bookerName &&
                                    "border-red-500 placeholder:text-red-400"
                            )}
                        />

                        {showValidation && errors?.bookerName && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.bookerName}
                            </p>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                            {t("some_one_else_helper")}
                        </p>
                    </div>
                )}

                {/* Email */}
                <div>
                    <Label>
                        {t("email")} <span className="text-red-500">*</span>
                    </Label>

                    <Input
                        type="email"
                        value={data.email || ""}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="email@example.com"
                        className={cn(
                            "mt-2 h-12",
                            showValidation &&
                                errors?.email &&
                                "border-red-500 placeholder:text-red-400"
                        )}
                    />

                    {showValidation && errors?.email && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.email}
                        </p>
                    )}

                    {(!showValidation || !errors?.email) && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("email_helper")}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <Label>
                        {t("phone_number")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>

                    <div className="flex gap-2 mt-2">
                        <CountryCodeSelect
                            value={data.countryCode || "+971"}
                            onValueChange={(v) => setField("countryCode", v)}
                        />

                        <Input
                            value={data.phone || ""}
                            onChange={(e) =>
                                setField(
                                    "phone",
                                    e.target.value.replace(/[^0-9]/g, "")
                                )
                            }
                            placeholder="50 123 4567"
                            className={cn(
                                "flex-1 h-12",
                                showValidation &&
                                    errors?.phone &&
                                    "border-red-500 placeholder:text-red-400 rtl:text-right"
                            )}
                        />
                    </div>

                    {showValidation && errors?.phone && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.phone}
                        </p>
                    )}

                    {(!showValidation || !errors?.phone) && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("phone_helper")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});

ContactInformation.displayName = "ContactInformation";
export default ContactInformation;
