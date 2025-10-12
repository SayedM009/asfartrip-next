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

const ContactInformation = forwardRef(({ onValidationChange }, ref) => {
    const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
    const [countryCode, setCountryCode] = useState("+971");

    const [bookerName, setBookerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [showValidation, setShowValidation] = useState(false);

    const storageKey = "contact_information";

    // Load from sessionStorage on mount
    useEffect(() => {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setBookingForSomeoneElse(data.bookingForSomeoneElse || false);
                setCountryCode(data.countryCode || "+971");
                setBookerName(data.bookerName || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");
            } catch (e) {
                console.error("Error loading contact data:", e);
            }
        }
    }, []);

    // Save to sessionStorage whenever data changes
    useEffect(() => {
        const data = {
            bookingForSomeoneElse,
            countryCode,
            bookerName,
            email,
            phone,
        };
        sessionStorage.setItem(storageKey, JSON.stringify(data));
    }, [bookingForSomeoneElse, countryCode, bookerName, email, phone]);

    const validateFields = () => {
        const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPhoneValid = phone && phone.trim().length >= 7;
        const isBookerNameValid =
            !bookingForSomeoneElse ||
            (bookerName && bookerName.trim().length > 0);

        return isEmailValid && isPhoneValid && isBookerNameValid;
    };

    useImperativeHandle(ref, () => ({
        triggerValidation: () => {
            setShowValidation(true);
            const isValid = validateFields();
            onValidationChange?.(isValid);
            return isValid;
        },
    }));

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800 rounded-lg border-2 shadow-sm p-6 transition-colors",
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
                        checked={bookingForSomeoneElse}
                        onCheckedChange={setBookingForSomeoneElse}
                        className="bg-accent-500 "
                    />
                </div>
            </div>

            <div className="space-y-6">
                {bookingForSomeoneElse && (
                    <div>
                        <Label htmlFor="bookerName">
                            Your Full Name{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="bookerName"
                            value={bookerName}
                            onChange={(e) => setBookerName(e.target.value)}
                            placeholder="Enter your full name"
                            className={cn(
                                "mt-2 h-12",
                                showValidation &&
                                    !bookerName &&
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className={cn(
                            "mt-2 h-12",
                            showValidation &&
                                (!email ||
                                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        email
                                    )) &&
                                "border-red-500 placeholder:text-red-400"
                        )}
                    />
                    {showValidation &&
                        email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                            <p className="text-xs text-red-500 mt-1">
                                Please enter a valid email address
                            </p>
                        )}
                    {(!showValidation ||
                        !email ||
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && (
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
                            value={countryCode}
                            onValueChange={setCountryCode}
                        />
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="50 123 4567"
                            className={cn(
                                "flex-1 h-12",
                                showValidation &&
                                    (!phone || phone.trim().length < 7) &&
                                    "border-red-500 placeholder:text-red-400"
                            )}
                        />
                    </div>
                    {showValidation && phone && phone.trim().length < 7 && (
                        <p className="text-xs text-red-500 mt-1">
                            Please enter a valid phone number (minimum 7 digits)
                        </p>
                    )}
                    {(!showValidation ||
                        !phone ||
                        phone.trim().length >= 7) && (
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

// import React, { useState } from "react";
// import { CountryCodeSelect } from "./CountryCodeSelect";
// import { Mail } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@radix-ui/react-label";
// import { Input } from "@/components/ui/input";

// export default function ContactInformation() {
//     const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
//     const [countryCode, setCountryCode] = useState("+971");
//     const [bookerCountryCode, setBookerCountryCode] = useState("+971");

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
//                 <div className="flex items-center gap-2 rtl:flex-row-reverse">
//                     <Mail className="w-5 h-5 text-blue-600" />
//                     <h3>Contact Information</h3>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Label
//                         htmlFor="bookingForOther"
//                         className="text-sm cursor-pointer whitespace-nowrap"
//                     >
//                         Booking for someone else
//                     </Label>
//                     <Switch
//                         id="bookingForOther"
//                         checked={bookingForSomeoneElse}
//                         onCheckedChange={setBookingForSomeoneElse}
//                     />
//                 </div>
//             </div>

//             <div className="space-y-6">
//                 {/* Conditional full name field when booking for someone else */}
//                 {bookingForSomeoneElse && (
//                     <div>
//                         <Label htmlFor="bookerName">Your Full Name *</Label>
//                         <Input
//                             id="bookerName"
//                             placeholder="Enter your full name"
//                             className="mt-2 h-12"
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">
//                             The person making the booking
//                         </p>
//                     </div>
//                 )}

//                 {/* Email */}
//                 <div>
//                     <Label htmlFor="email">Email Address *</Label>
//                     <Input
//                         id="email"
//                         type="email"
//                         placeholder="your.email@example.com"
//                         className="mt-2 h-12"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                         Booking confirmation will be sent to this email
//                     </p>
//                 </div>

//                 {/* Phone */}
//                 <div>
//                     <Label htmlFor="phone">Mobile Number *</Label>
//                     <div className="flex gap-2 mt-2">
//                         <CountryCodeSelect
//                             value={countryCode}
//                             onValueChange={setCountryCode}
//                         />
//                         <Input
//                             id="phone"
//                             type="tel"
//                             placeholder="50 123 4567"
//                             className="flex-1 h-12"
//                         />
//                     </div>
//                     <p className="text-xs text-muted-foreground mt-1">
//                         We&apos;ll contact you on this number if needed
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }
