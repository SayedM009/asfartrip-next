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

const ContactInformation = forwardRef(({ onValidationChange }, ref) => {
    const [showValidation, setShowValidation] = useState(false);

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
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                    <Mail className="size-5 text-accent-600" />
                    <h3>Contact Information</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor="bookingForOther"
                        className="text-xs cursor-pointer whitespace-nowrap"
                    >
                        Someone else
                    </Label>
                    <Switch
                        id="bookingForOther"
                        checked={contactInfo.bookingForSomeoneElse || false}
                        onCheckedChange={(checked) =>
                            handleFieldChange("bookingForSomeoneElse", checked)
                        }
                        className="bg-accent-500"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {contactInfo.bookingForSomeoneElse && (
                    <div>
                        <Label htmlFor="bookerName">
                            Your Full Name{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="bookerName"
                            value={contactInfo.bookerName || ""}
                            onChange={(e) =>
                                handleFieldChange("bookerName", e.target.value)
                            }
                            placeholder="Enter your full name"
                            className={cn(
                                "mt-2 h-12",
                                showValidation &&
                                    !contactInfo.bookerName &&
                                    "border-red-500 placeholder:text-red-400"
                            )}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            The person making the booking
                        </p>
                    </div>
                )}

                {/* Email */}
                <div>
                    <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={contactInfo.email || ""}
                        onChange={(e) =>
                            handleFieldChange("email", e.target.value)
                        }
                        placeholder="your.email@example.com"
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
                                Please enter a valid email address
                            </p>
                        )}
                    {(!showValidation ||
                        !contactInfo.email ||
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            contactInfo.email
                        )) && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Booking confirmation will be sent to this email
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <Label htmlFor="phone">
                        Mobile Number <span className="text-red-500">*</span>
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
                                    "border-red-500 placeholder:text-red-400"
                            )}
                        />
                    </div>
                    {showValidation &&
                        contactInfo.phone &&
                        contactInfo.phone.trim().length < 7 && (
                            <p className="text-xs text-red-500 mt-1">
                                Please enter a valid phone number (minimum 7
                                digits)
                            </p>
                        )}
                    {(!showValidation ||
                        !contactInfo.phone ||
                        contactInfo.phone.trim().length >= 7) && (
                        <p className="text-xs text-muted-foreground mt-1">
                            We&apos;ll contact you on this number if needed
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});

ContactInformation.displayName = "ContactInformation";

export default ContactInformation;
