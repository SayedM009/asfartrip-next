import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { NationalitySelect } from "./NationalitySelect";
import { DateDropdownFields } from "./DateDropdownFields";
import { SavedTravelerSelect } from "./SavedTravelerSelect";
import { User, Check, Save, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const TravelerInformationSection = forwardRef(
    (
        {
            travelerNumber,
            travelerType,
            isLoggedIn = false,
            onValidationChange,
        },
        ref
    ) => {
        const [isCompleted, setIsCompleted] = useState(false);
        const [isLocked, setIsLocked] = useState(false);
        const [title, setTitle] = useState("");
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [dateOfBirth, setDateOfBirth] = useState();
        const [passportNumber, setPassportNumber] = useState("");
        const [passportExpiry, setPassportExpiry] = useState();
        const [nationality, setNationality] = useState("");
        const [showValidation, setShowValidation] = useState(false);
        const [accordionValue, setAccordionValue] = useState("open");

        const sectionRef = useRef(null);
        const storageKey = `traveler_${travelerNumber}_${travelerType}`;

        // Load from sessionStorage on mount
        useEffect(() => {
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    setTitle(data.title || "");
                    setFirstName(data.firstName || "");
                    setLastName(data.lastName || "");
                    setDateOfBirth(data.dateOfBirth);
                    setPassportNumber(data.passportNumber || "");
                    setPassportExpiry(data.passportExpiry);
                    setNationality(data.nationality || "");

                    // If all fields are complete, mark as completed
                    if (data.isCompleted) {
                        setIsCompleted(true);
                        setIsLocked(true);
                        setAccordionValue("");
                    }
                } catch (e) {
                    console.error("Error loading traveler data:", e);
                }
            }
        }, [storageKey]);

        // Save to sessionStorage whenever data changes
        useEffect(() => {
            const data = {
                title,
                firstName,
                lastName,
                dateOfBirth,
                passportNumber,
                passportExpiry,
                nationality,
                isCompleted,
            };
            sessionStorage.setItem(storageKey, JSON.stringify(data));
        }, [
            title,
            firstName,
            lastName,
            dateOfBirth,
            passportNumber,
            passportExpiry,
            nationality,
            isCompleted,
            storageKey,
        ]);

        const handleSavedTravelerSelect = (traveler) => {
            setTitle(traveler.title);
            setFirstName(traveler.firstName);
            setLastName(traveler.lastName);
            setDateOfBirth(traveler.dateOfBirth);
            setPassportNumber(traveler.passportNumber);
            setPassportExpiry(traveler.passportExpiry);
            setNationality(traveler.nationality);
        };

        const handleSave = () => {
            setShowValidation(true);

            if (
                !title ||
                !firstName ||
                !lastName ||
                !dateOfBirth ||
                !passportNumber ||
                !passportExpiry ||
                !nationality
            ) {
                sectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                onValidationChange?.(false);
                return;
            }

            setIsCompleted(true);
            setIsLocked(true);
            setAccordionValue("");
            onValidationChange?.(true);
        };

        const handleEdit = () => {
            setIsLocked(false);
            setAccordionValue("open");
        };

        useImperativeHandle(ref, () => ({
            triggerValidation: () => {
                setShowValidation(true);
                const isValid = !!(
                    title &&
                    firstName &&
                    lastName &&
                    dateOfBirth &&
                    passportNumber &&
                    passportExpiry &&
                    nationality
                );
                onValidationChange?.(isValid);

                // If not valid, open the accordion
                if (!isValid) {
                    setAccordionValue("open");
                }

                return isValid;
            },
        }));

        return (
            <div
                ref={sectionRef}
                className={cn(
                    "bg-white dark:bg-gray-800 rounded-lg border-2 transition-all",
                    isCompleted ? "border-green-500" : "border-border",
                    showValidation && !isCompleted && "border-red-500"
                )}
            >
                <Accordion
                    type="single"
                    collapsible
                    value={isLocked ? "" : accordionValue}
                    onValueChange={setAccordionValue}
                >
                    <AccordionItem value="open" className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-center gap-4 w-full">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                        isCompleted
                                            ? "bg-green-500 text-white"
                                            : "bg-primary-500 text-white"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : travelerType === "Infant" ? (
                                        <Baby className="w-5 h-5" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="text-left rtl:text-right flex-1">
                                    <h3 className="text-lg">
                                        {firstName && lastName
                                            ? `${firstName} ${lastName}`
                                            : `Traveler ${String(
                                                  travelerNumber
                                              ).padStart(2, 0)}`}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {travelerType}
                                    </p>
                                </div>
                                {isCompleted && (
                                    <div className="flex items-center gap-3 mr-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit();
                                            }}
                                            className="h-8"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-6 pb-6 space-y-6">
                            {isLoggedIn && (
                                <div className="max-w-md">
                                    <SavedTravelerSelect
                                        onSelect={handleSavedTravelerSelect}
                                    />
                                </div>
                            )}

                            {/* Title Selection */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    Title{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-3">
                                    {[
                                        { value: "mr", label: "Mr." },
                                        { value: "mrs", label: "Mrs." },
                                        { value: "miss", label: "Miss" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setTitle(option.value)
                                            }
                                            className={cn(
                                                "flex-1 px-6 py-3 rounded-lg border-2 transition-all",
                                                showValidation &&
                                                    !title &&
                                                    "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                title === option.value
                                                    ? "border-primary-500 bg-primary-500 text-white shadow-md"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`firstName-${travelerNumber}`}
                                    >
                                        First Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`firstName-${travelerNumber}`}
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="JOHN"
                                        className={cn(
                                            "h-12 mt-2",
                                            showValidation &&
                                                !firstName &&
                                                "border-red-500 placeholder:text-red-400"
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        As shown on passport
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`lastName-${travelerNumber}`}
                                    >
                                        Last Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`lastName-${travelerNumber}`}
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="SMITH"
                                        className={cn(
                                            "h-12 mt-2",
                                            showValidation &&
                                                !lastName &&
                                                "border-red-500 placeholder:text-red-400"
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        As shown on passport
                                    </p>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <DateDropdownFields
                                label="Date of Birth"
                                value={dateOfBirth}
                                onChange={setDateOfBirth}
                                maxDate={new Date()}
                                required
                                error={showValidation && !dateOfBirth}
                                id={`dob-${travelerNumber}`}
                            />

                            {/* Passport Details */}
                            <div
                                className={cn(
                                    "space-y-4 p-4 rounded-lg border transition-colors",
                                    "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                )}
                            >
                                <h4 className="text-sm flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Passport Information
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`passport-${travelerNumber}`}
                                        >
                                            Passport Number{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id={`passport-${travelerNumber}`}
                                            value={passportNumber}
                                            onChange={(e) =>
                                                setPassportNumber(
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                            placeholder="A12345678"
                                            className={cn(
                                                "h-12 font-mono mt-2",
                                                showValidation &&
                                                    !passportNumber &&
                                                    "border-red-500 placeholder:text-red-400"
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Nationality{" "}
                                            <span className="text-red-500 ">
                                                *
                                            </span>
                                        </Label>
                                        <div
                                            className={cn(
                                                "mt-2",
                                                showValidation &&
                                                    !nationality &&
                                                    "ring-1 ring-red-500 rounded-lg"
                                            )}
                                        >
                                            <NationalitySelect
                                                value={nationality}
                                                onValueChange={setNationality}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DateDropdownFields
                                    label="Passport Expiry Date"
                                    value={passportExpiry}
                                    onChange={setPassportExpiry}
                                    minDate={new Date()}
                                    required
                                    error={showValidation && !passportExpiry}
                                    id={`passport-expiry-${travelerNumber}`}
                                />
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    onClick={handleSave}
                                    className="btn-primary"
                                >
                                    <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                    Save Traveler Information
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }
);

TravelerInformationSection.displayName = "TravelerInformationSection";

export default TravelerInformationSection;
// import React, { useState, useRef } from "react";
// import { NationalitySelect } from "./NationalitySelect";
// import { DateDropdownFields } from "./DateDropdownFields";
// import { SavedTravelerSelect } from "./SavedTravelerSelect";
// import { User, Check, Save, Baby } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@radix-ui/react-label";
// import { Input } from "@/components/ui/input";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
// import { cn } from "@/lib/utils";

// export default function TravelerInformationSection({
//     travelerNumber,
//     travelerType,
//     isLoggedIn = false,
//     onValidationChange,
// }) {
//     const [isCompleted, setIsCompleted] = useState(false);
//     const [isLocked, setIsLocked] = useState(false);
//     const [title, setTitle] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [dateOfBirth, setDateOfBirth] = useState();
//     const [passportNumber, setPassportNumber] = useState("");
//     const [passportExpiry, setPassportExpiry] = useState();
//     const [nationality, setNationality] = useState("");
//     const [showValidation, setShowValidation] = useState(false);
//     const [accordionValue, setAccordionValue] = useState("open");

//     const sectionRef = useRef(null);

//     const handleSavedTravelerSelect = (traveler) => {
//         setTitle(traveler.title);
//         setFirstName(traveler.firstName);
//         setLastName(traveler.lastName);
//         setDateOfBirth(traveler.dateOfBirth);
//         setPassportNumber(traveler.passportNumber);
//         setPassportExpiry(traveler.passportExpiry);
//         setNationality(traveler.nationality);
//     };

//     const handleSave = () => {
//         setShowValidation(true);

//         if (
//             !title ||
//             !firstName ||
//             !lastName ||
//             !dateOfBirth ||
//             !passportNumber ||
//             !passportExpiry ||
//             !nationality
//         ) {
//             sectionRef.current?.scrollIntoView({
//                 behavior: "smooth",
//                 block: "center",
//             });
//             onValidationChange?.(false);
//             return;
//         }

//         setIsCompleted(true);
//         setIsLocked(true);
//         setAccordionValue("");
//         onValidationChange?.(true);
//     };

//     const handleEdit = () => {
//         setIsLocked(false);
//         setAccordionValue("open");
//     };

//     // Expose validation trigger
//     React.useImperativeHandle(sectionRef, () => ({
//         triggerValidation: () => {
//             setShowValidation(true);
//             const isValid = !!(
//                 title &&
//                 firstName &&
//                 lastName &&
//                 dateOfBirth &&
//                 passportNumber &&
//                 passportExpiry &&
//                 nationality
//             );
//             onValidationChange?.(isValid);
//             return isValid;
//         },
//     }));

//     return (
//         <div
//             ref={sectionRef}
//             className={cn(
//                 "bg-white dark:bg-gray-800 rounded-lg border transition-all",
//                 isCompleted ? "border-green-500" : "border-border",
//                 showValidation && !isCompleted && "border-red-500"
//             )}
//         >
//             <Accordion
//                 type="single"
//                 collapsible
//                 value={isLocked ? "" : accordionValue}
//                 onValueChange={setAccordionValue}
//             >
//                 <AccordionItem value="open" className="border-none">
//                     <AccordionTrigger className="px-6 py-4 hover:no-underline">
//                         <div className="flex items-center gap-4 w-full">
//                             <div
//                                 className={cn(
//                                     "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
//                                     isCompleted
//                                         ? "bg-green-500 text-white"
//                                         : "bg-blue-500 text-white"
//                                 )}
//                             >
//                                 {isCompleted ? (
//                                     <Check className="w-5 h-5" />
//                                 ) : travelerType === "Infant" ? (
//                                     <Baby className="w-5 h-5" />
//                                 ) : (
//                                     <User className="w-5 h-5" />
//                                 )}
//                             </div>
//                             <div className="text-left rtl:text-right flex-1">
//                                 <h3 className="text-lg">
//                                     {firstName && lastName
//                                         ? `${firstName} ${lastName}`
//                                         : `Traveler ${travelerNumber}`}
//                                 </h3>
//                                 <p className="text-sm text-muted-foreground">
//                                     {travelerType}
//                                 </p>
//                             </div>
//                             {isCompleted && (
//                                 <div className="flex items-center gap-3 mr-2">
//                                     <span className="text-sm text-green-600 dark:text-green-400">
//                                         Completed
//                                     </span>
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleEdit();
//                                         }}
//                                         className="h-8"
//                                     >
//                                         Edit
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     </AccordionTrigger>

//                     <AccordionContent className="px-6 pb-6 space-y-6">
//                         {isLoggedIn && (
//                             <div className="max-w-md">
//                                 <SavedTravelerSelect
//                                     onSelect={handleSavedTravelerSelect}
//                                 />
//                             </div>
//                         )}

//                         {/* Title Selection */}
//                         <div className="space-y-3">
//                             <Label className="flex items-center gap-2">
//                                 Title <span className="text-red-500">*</span>
//                             </Label>
//                             <div className="flex gap-3">
//                                 {[
//                                     { value: "mr", label: "Mr." },
//                                     { value: "mrs", label: "Mrs." },
//                                     { value: "miss", label: "Miss" },
//                                 ].map((option) => (
//                                     <button
//                                         key={option.value}
//                                         type="button"
//                                         onClick={() => setTitle(option.value)}
//                                         className={cn(
//                                             "flex-1 px-6 py-3 rounded-lg border-2 transition-all",
//                                             showValidation &&
//                                                 !title &&
//                                                 "border-red-500 bg-red-50 dark:bg-red-950/20",
//                                             title === option.value
//                                                 ? "border-blue-500 bg-blue-500 text-white shadow-md"
//                                                 : "border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
//                                         )}
//                                     >
//                                         {option.label}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Name Fields */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor={`firstName-${travelerNumber}`}>
//                                     First Name{" "}
//                                     <span className="text-red-500">*</span>
//                                 </Label>
//                                 <Input
//                                     id={`firstName-${travelerNumber}`}
//                                     value={firstName}
//                                     onChange={(e) =>
//                                         setFirstName(
//                                             e.target.value.toUpperCase()
//                                         )
//                                     }
//                                     placeholder="JOHN"
//                                     className={cn(
//                                         "h-12",
//                                         showValidation &&
//                                             !firstName &&
//                                             "border-red-500 placeholder:text-red-400"
//                                     )}
//                                 />
//                                 <p className="text-xs text-muted-foreground">
//                                     As shown on passport
//                                 </p>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor={`lastName-${travelerNumber}`}>
//                                     Last Name{" "}
//                                     <span className="text-red-500">*</span>
//                                 </Label>
//                                 <Input
//                                     id={`lastName-${travelerNumber}`}
//                                     value={lastName}
//                                     onChange={(e) =>
//                                         setLastName(
//                                             e.target.value.toUpperCase()
//                                         )
//                                     }
//                                     placeholder="SMITH"
//                                     className={cn(
//                                         "h-12",
//                                         showValidation &&
//                                             !lastName &&
//                                             "border-red-500 placeholder:text-red-400"
//                                     )}
//                                 />
//                                 <p className="text-xs text-muted-foreground">
//                                     As shown on passport
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Date of Birth */}
//                         <DateDropdownFields
//                             label="Date of Birth"
//                             value={dateOfBirth}
//                             onChange={setDateOfBirth}
//                             maxDate={new Date()}
//                             required
//                             error={showValidation && !dateOfBirth}
//                             id={`dob-${travelerNumber}`}
//                         />

//                         {/* Passport Details */}
//                         <div
//                             className={cn(
//                                 "space-y-4 p-4 rounded-lg border transition-colors",
//                                 showValidation &&
//                                     (!passportNumber ||
//                                         !nationality ||
//                                         !passportExpiry)
//                                     ? "bg-red-50 dark:bg-red-950/20 border-red-500"
//                                     : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
//                             )}
//                         >
//                             <h4 className="text-sm flex items-center gap-2">
//                                 <svg
//                                     className="w-4 h-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                     />
//                                 </svg>
//                                 Passport Information
//                             </h4>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor={`passport-${travelerNumber}`}
//                                     >
//                                         Passport Number{" "}
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Input
//                                         id={`passport-${travelerNumber}`}
//                                         value={passportNumber}
//                                         onChange={(e) =>
//                                             setPassportNumber(
//                                                 e.target.value.toUpperCase()
//                                             )
//                                         }
//                                         placeholder="A12345678"
//                                         className={cn(
//                                             "h-12 font-mono",
//                                             showValidation &&
//                                                 !passportNumber &&
//                                                 "border-red-500 placeholder:text-red-400"
//                                         )}
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label>
//                                         Nationality{" "}
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <div
//                                         className={cn(
//                                             showValidation &&
//                                                 !nationality &&
//                                                 "ring-2 ring-red-500 rounded-lg"
//                                         )}
//                                     >
//                                         <NationalitySelect
//                                             value={nationality}
//                                             onValueChange={setNationality}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <DateDropdownFields
//                                 label="Passport Expiry Date"
//                                 value={passportExpiry}
//                                 onChange={setPassportExpiry}
//                                 minDate={new Date()}
//                                 required
//                                 error={showValidation && !passportExpiry}
//                                 id={`passport-expiry-${travelerNumber}`}
//                             />
//                         </div>

//                         {/* Save Button */}
//                         <div className="flex justify-end gap-3 pt-4 border-t">
//                             <Button
//                                 onClick={handleSave}
//                                 className="bg-blue-600 hover:bg-blue-700"
//                             >
//                                 <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
//                                 Save Traveler Information
//                             </Button>
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>
//             </Accordion>
//         </div>
//     );
// }
