import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useBookingStore from "@/app/_store/bookingStore";
import { useTranslations } from "next-intl";

const ContactInformation = forwardRef(({ onValidationChange }, ref) => {
    const [showValidation, setShowValidation] = useState(false);
    const t = useTranslations("Traveler");

    // Get contact info from store
    const contactInfo = useBookingStore((state) => state.contactInfo);
    const updateContactInfo = useBookingStore(
        (state) => state.updateContactInfo
    );

    const validateFields = () => {
        const isEmailValid =
            contactInfo.email &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
        const isPhoneValid =
            contactInfo.phone && contactInfo.phone.trim().length >= 7;
        const isBookerNameValid =
            !contactInfo.bookingForSomeoneElse ||
            (contactInfo.bookerName &&
                contactInfo.bookerName.trim().length > 0);

        return isEmailValid && isPhoneValid && isBookerNameValid;
    };

    // Auto-validate when fields change
    useEffect(() => {
        const isValid = validateFields();
        onValidationChange?.(isValid);
    }, [contactInfo]);

    useImperativeHandle(ref, () => ({
        triggerValidation: () => {
            setShowValidation(true);
            const isValid = validateFields();
            onValidationChange?.(isValid);
            return isValid;
        },
        getData: () => contactInfo,
    }));

    const handleFieldChange = (field, value) => {
        updateContactInfo({ [field]: value });
    };

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800/50 rounded-lg border-2 shadow-sm p-6 transition-colors",
                showValidation && !validateFields() && "border-red-500"
            )}
        >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 ">
                    <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                    </div>
                    <h3>{t("contact_information")}</h3>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                    <Label
                        htmlFor="bookingForOther"
                        className="text-xs cursor-pointer whitespace-nowrap"
                    >
                        {t("some_one_else")}
                    </Label>
                    <Switch
                        id="bookingForOther"
                        checked={contactInfo.bookingForSomeoneElse || false}
                        onCheckedChange={(checked) =>
                            handleFieldChange("bookingForSomeoneElse", checked)
                        }
                        className="bg-accent-500"
                        dir="ltr"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {contactInfo.bookingForSomeoneElse && (
                    <div>
                        <Label htmlFor="bookerName">
                            {t("full_name")}{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="bookerName"
                            value={contactInfo.bookerName || ""}
                            onChange={(e) =>
                                handleFieldChange("bookerName", e.target.value)
                            }
                            placeholder={t("full_name_placeholder")}
                            className={cn(
                                "mt-2 h-12",
                                showValidation &&
                                    !contactInfo.bookerName &&
                                    "border-red-500 placeholder:text-red-400"
                            )}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("some_one_else_helper")}
                        </p>
                    </div>
                )}

                {/* Email */}
                <div>
                    <Label htmlFor="email">
                        {t("email")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={contactInfo.email || ""}
                        onChange={(e) =>
                            handleFieldChange("email", e.target.value)
                        }
                        placeholder="email@example.com"
                        className={cn(
                            "mt-2 h-12",
                            showValidation &&
                                (!contactInfo.email ||
                                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        contactInfo.email
                                    )) &&
                                "border-red-500 placeholder:text-red-400"
                        )}
                    />
                    {showValidation &&
                        contactInfo.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            contactInfo.email
                        ) && (
                            <p className="text-xs text-red-500 mt-1">
                                {t("valid_email")}
                            </p>
                        )}
                    {(!showValidation ||
                        !contactInfo.email ||
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            contactInfo.email
                        )) && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("email_helper")}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <Label htmlFor="phone">
                        {t("phone_number")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 mt-2">
                        <CountryCodeSelect
                            value={contactInfo.countryCode || "+971"}
                            onValueChange={(value) =>
                                handleFieldChange("countryCode", value)
                            }
                        />
                        <Input
                            id="phone"
                            type="tel"
                            value={contactInfo.phone || ""}
                            onChange={(e) =>
                                handleFieldChange("phone", e.target.value)
                            }
                            placeholder="50 123 4567"
                            className={cn(
                                "flex-1 h-12",
                                showValidation &&
                                    (!contactInfo.phone ||
                                        contactInfo.phone.trim().length < 7) &&
                                    "border-red-500 placeholder:text-red-400 rtl:text-right"
                            )}
                        />
                    </div>
                    {showValidation &&
                        contactInfo.phone &&
                        contactInfo.phone.trim().length < 7 && (
                            <p className="text-xs text-red-500 mt-1">
                                {t("valid_mobile_number")}
                            </p>
                        )}
                    {(!showValidation ||
                        !contactInfo.phone ||
                        contactInfo.phone.trim().length >= 7) && (
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
