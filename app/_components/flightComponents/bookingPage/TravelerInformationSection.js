// components/travelers/TravelerInformationSection.jsx
import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { User, Check, Baby, Save } from "lucide-react";
import useBookingStore from "@/app/_store/bookingStore";
import { useTranslations } from "next-intl";
import TravelerBasicFields, { calcAge } from "../../TravelerBasicFields";
import { SavedTravelerSelect } from "./SavedTravelerSelect";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TravelerInformationSection = forwardRef(
    (
        {
            travelerNumber,
            travelerType, // "Adult" | "Child" | "Infant"
            isLoggedIn = false,
            onValidationChange,
            withAccordion = true, // Booking = true, Profile/Dialog = false
            showInternalSave = true, // Booking = true, Profile/Dialog = false
        },
        ref
    ) => {
        const sectionRef = useRef(null);
        const t = useTranslations("Traveler");
        const p = useTranslations("Flight");

        const traveler = useBookingStore((s) => s.getTraveler(travelerNumber));
        const updateTraveler = useBookingStore((s) => s.updateTraveler);

        const [showValidation, setShowValidation] = useState(false);
        const [accordionValue, setAccordionValue] = useState("open");
        const [isLocked, setIsLocked] = useState(false);
        const [ageError, setAgeError] = useState("");

        // فتح/غلق الأكوردين حسب isCompleted
        useEffect(() => {
            if (!withAccordion) return;
            if (traveler?.isCompleted) {
                setIsLocked(true);
                setAccordionValue("");
            } else {
                setIsLocked(false);
                if (!accordionValue) setAccordionValue("open");
            }
        }, [traveler?.isCompleted, withAccordion, accordionValue]);

        // حدود التاريخ حسب النوع
        const getDateLimits = () => {
            const today = new Date();
            if (travelerType === "Adult") {
                return {
                    maxDate: new Date(
                        today.getFullYear() - 12,
                        today.getMonth(),
                        today.getDate()
                    ),
                    minDate: new Date(
                        today.getFullYear() - 100,
                        today.getMonth(),
                        today.getDate()
                    ),
                };
            }
            if (travelerType === "Child") {
                return {
                    maxDate: new Date(
                        today.getFullYear() - 2,
                        today.getMonth(),
                        today.getDate()
                    ),
                    minDate: new Date(
                        today.getFullYear() - 12,
                        today.getMonth(),
                        today.getDate()
                    ),
                };
            }
            return {
                maxDate: today,
                minDate: new Date(
                    today.getFullYear() - 2,
                    today.getMonth(),
                    today.getDate()
                ),
            };
        };
        const { minDate, maxDate } = getDateLimits();

        // ✅ تحقق من صحة العمر بناءً على نوع المسافر
        const validateAge = (dob) => {
            const age = calcAge(dob);
            if (age === null) return { valid: false, message: "" };

            if (travelerType === "Adult" && age < 12) {
                return {
                    valid: false,
                    message:
                        t("age_must_be_12_or_above") ||
                        "Adult must be 12 years or older",
                };
            }
            if (travelerType === "Child" && (age < 2 || age >= 12)) {
                return {
                    valid: false,
                    message:
                        t("age_must_be_between_2_and_12") ||
                        "Child must be between 2 and 11 years old",
                };
            }
            if (travelerType === "Infant" && age >= 2) {
                return {
                    valid: false,
                    message:
                        t("age_must_be_under_2") ||
                        "Infant must be under 2 years old",
                };
            }

            return { valid: true, message: "" };
        };

        // تحقّق الحقول
        const allFieldsValid = () => {
            if (!traveler) return false;

            const hasAll =
                traveler.title &&
                traveler.firstName &&
                traveler.lastName &&
                traveler.dateOfBirth &&
                traveler.passportNumber &&
                traveler.passportExpiry &&
                traveler.nationality;

            if (!hasAll) {
                setAgeError("");
                return false;
            }

            // تحقّق العمر
            const ageValidation = validateAge(traveler.dateOfBirth);
            if (!ageValidation.valid) {
                setAgeError(ageValidation.message);
                return false;
            }

            setAgeError("");
            return true;
        };

        const handleFieldChange = (field, value) => {
            // لو الحقل هو DOB، تحقق من العمر
            if (field === "dateOfBirth" && value) {
                const ageValidation = validateAge(value);
                setAgeError(ageValidation.valid ? "" : ageValidation.message);
            }

            updateTraveler(travelerNumber, { [field]: value });
        };

        const handleSavedTravelerSelect = (savedTraveler) => {
            const dateOfBirth = savedTraveler.dateOfBirth
                ? savedTraveler.dateOfBirth instanceof Date
                    ? savedTraveler.dateOfBirth
                    : new Date(savedTraveler.dateOfBirth)
                : null;

            const passportExpiry = savedTraveler.passportExpiry
                ? savedTraveler.passportExpiry instanceof Date
                    ? savedTraveler.passportExpiry
                    : new Date(savedTraveler.passportExpiry)
                : null;

            // ✅ تحديث جميع الحقول دفعة واحدة
            updateTraveler(travelerNumber, {
                title: savedTraveler.title || "",
                firstName: savedTraveler.firstName || "",
                lastName: savedTraveler.lastName || "",
                dateOfBirth,
                passportNumber: savedTraveler.passportNumber || "",
                passportExpiry,
                nationality: savedTraveler.nationality || "",
            });

            // ✅ تحقق من العمر بعد التحديد
            if (dateOfBirth) {
                const ageValidation = validateAge(dateOfBirth);
                setAgeError(ageValidation.valid ? "" : ageValidation.message);
            } else {
                setAgeError("");
            }
        };

        const handleSaveInternal = () => {
            setShowValidation(true);

            const isValid = allFieldsValid();
            onValidationChange?.(isValid);

            if (!isValid) {
                sectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                if (withAccordion) {
                    setAccordionValue("open");
                    setIsLocked(false);
                }
                return;
            }

            updateTraveler(travelerNumber, { isCompleted: true });

            if (withAccordion) {
                setIsLocked(true);
                setAccordionValue("");
            }
        };

        useImperativeHandle(ref, () => ({
            triggerValidation: () => {
                setShowValidation(true);
                const ok = allFieldsValid();
                onValidationChange?.(ok);
                if (!ok && withAccordion) {
                    setAccordionValue("open");
                    setIsLocked(false);
                }
                return ok;
            },
            getData: () => traveler,
            open: () => {
                if (withAccordion) {
                    setAccordionValue("open");
                    setIsLocked(false);
                }
            },
            close: () => {
                if (withAccordion) {
                    setAccordionValue("");
                    setIsLocked(true);
                }
            },
        }));

        if (!traveler) return null;

        const fields = (
            <TravelerBasicFields
                traveler={traveler}
                showValidation={showValidation}
                minDob={minDate}
                maxDob={maxDate}
                onFieldChange={handleFieldChange}
                isLoggedIn={isLoggedIn}
                ageError={ageError}
                SavedTravelerSlot={
                    <div className="w-full flex justify-end">
                        <SavedTravelerSelect
                            onSelect={handleSavedTravelerSelect}
                        />
                    </div>
                }
            />
        );

        // وضع بدون Accordion (Profile / New Traveler)
        if (!withAccordion) {
            return (
                <div
                    ref={sectionRef}
                    className={cn(
                        "bg-white dark:bg-gray-800/50 rounded-lg border-2 transition-all p-6",
                        traveler.isCompleted
                            ? "border-green-500"
                            : "border-border",
                        showValidation &&
                            !traveler.isCompleted &&
                            "border-red-500"
                    )}
                >
                    {fields}
                </div>
            );
        }

        // وضع Booking (Accordion + زر داخلي)
        return (
            <div
                ref={sectionRef}
                className={cn(
                    "bg-white dark:bg-gray-800/50 rounded-lg border-2 transition-all",
                    traveler.isCompleted ? "border-green-500" : "border-border",
                    showValidation && !traveler.isCompleted && "border-red-500"
                )}
            >
                <Accordion
                    type="single"
                    collapsible
                    value={isLocked ? "" : accordionValue}
                    onValueChange={setAccordionValue}
                >
                    <AccordionItem value="open" className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-4 w-full">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        traveler.isCompleted
                                            ? "bg-green-500 text-white"
                                            : "bg-accent-100 text-accent-600"
                                    )}
                                >
                                    {traveler.isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : travelerType === "Infant" ? (
                                        <Baby className="w-5 h-5" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="text-left rtl:text-right flex-1">
                                    <h3 className="text-lg">
                                        {traveler.firstName && traveler.lastName
                                            ? `${traveler.firstName} ${traveler.lastName}`
                                            : `${p(
                                                  "booking.traveler"
                                              )} ${String(
                                                  travelerNumber
                                              ).padStart(2, "0")}`}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            `${String(
                                                travelerType
                                            ).toLowerCase()}`
                                        )}
                                    </p>
                                </div>
                                {traveler.isCompleted && (
                                    <div className="flex items-center gap-3 mr-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateTraveler(travelerNumber, {
                                                    isCompleted: false,
                                                });
                                                setIsLocked(false);
                                                setAccordionValue("open");
                                            }}
                                            className="h-8 p-2 cursor-pointer"
                                        >
                                            {t("edit")}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-6 pb-6 space-y-6">
                            {fields}

                            {showInternalSave && (
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button
                                        onClick={handleSaveInternal}
                                        className="btn-primary"
                                    >
                                        <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        {t("save_traveler_information")}
                                    </Button>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }
);

TravelerInformationSection.displayName = "TravelerInformationSection";
export default TravelerInformationSection;

// import React, {
//     useState,
//     useRef,
//     useEffect,
//     forwardRef,
//     useImperativeHandle,
// } from "react";
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
// import useBookingStore from "@/app/_store/bookingStore";
// import { useTranslations } from "next-intl";

// const TravelerInformationSection = forwardRef(
//     (
//         {
//             travelerNumber,
//             travelerType,
//             isLoggedIn = false,
//             onValidationChange,
//         },
//         ref
//     ) => {
//         const sectionRef = useRef(null);

//         const t = useTranslations("Traveler");
//         const p = useTranslations("Flight");

//         // Get traveler data from store
//         const traveler = useBookingStore((state) =>
//             state.getTraveler(travelerNumber)
//         );
//         const updateTraveler = useBookingStore((state) => state.updateTraveler);

//         // Local state for UI control
//         const [showValidation, setShowValidation] = useState(false);
//         const [accordionValue, setAccordionValue] = useState("");
//         const [isLocked, setIsLocked] = useState(false);
//         const [dateError, setDateError] = useState("");

//         // Initialize accordion state based on completion
//         useEffect(() => {
//             if (traveler?.isCompleted) {
//                 setIsLocked(true);
//                 setAccordionValue("");
//             } else {
//                 setIsLocked(false);
//                 if (!accordionValue) {
//                     setAccordionValue("open");
//                 }
//             }
//         }, [traveler?.isCompleted]);

//         // ✅ دالة لحساب العمر
//         const calculateAge = (dateOfBirth) => {
//             if (!dateOfBirth) return null;
//             const today = new Date();
//             const birthDate = new Date(dateOfBirth);
//             let age = today.getFullYear() - birthDate.getFullYear();
//             const monthDiff = today.getMonth() - birthDate.getMonth();

//             if (
//                 monthDiff < 0 ||
//                 (monthDiff === 0 && today.getDate() < birthDate.getDate())
//             ) {
//                 age--;
//             }

//             return age;
//         };

//         // ✅ دالة للتحقق من صحة العمر بناءً على نوع المسافر
//         const validateAge = (dateOfBirth, type) => {
//             const age = calculateAge(dateOfBirth);

//             if (age === null) return { valid: false, message: "" };

//             if (type === "Adult") {
//                 if (age < 12) {
//                     return {
//                         valid: false,
//                         message:
//                             t("age_must_be_12_or_above") ||
//                             "Adult must be 12 years or older",
//                     };
//                 }
//             } else if (type === "Child") {
//                 if (age < 2 || age >= 12) {
//                     return {
//                         valid: false,
//                         message:
//                             t("age_must_be_between_2_and_12") ||
//                             "Child must be between 2 and 11 years old",
//                     };
//                 }
//             } else if (type === "Infant") {
//                 if (age >= 2) {
//                     return {
//                         valid: false,
//                         message:
//                             t("age_must_be_under_2") ||
//                             "Infant must be under 2 years old",
//                     };
//                 }
//             }

//             return { valid: true, message: "" };
//         };

//         // Check if all fields are valid
//         const checkAllFieldsValid = () => {
//             if (!traveler) return false;

//             const hasAllFields = !!(
//                 traveler.title &&
//                 traveler.firstName &&
//                 traveler.lastName &&
//                 traveler.dateOfBirth &&
//                 traveler.passportNumber &&
//                 traveler.passportExpiry &&
//                 traveler.nationality
//             );

//             if (!hasAllFields) return false;

//             // ✅ التحقق من صحة العمر
//             const ageValidation = validateAge(
//                 traveler.dateOfBirth,
//                 travelerType
//             );
//             if (!ageValidation.valid) {
//                 setDateError(ageValidation.message);
//                 return false;
//             }

//             setDateError("");
//             return true;
//         };

//         const handleFieldChange = (field, value) => {
//             // ✅ إذا كان الحقل هو تاريخ الميلاد، تحقق من العمر
//             if (field === "dateOfBirth" && value) {
//                 const ageValidation = validateAge(value, travelerType);
//                 if (!ageValidation.valid) {
//                     setDateError(ageValidation.message);
//                 } else {
//                     setDateError("");
//                 }
//             }

//             updateTraveler(travelerNumber, { [field]: value });
//         };

//         const handleSavedTravelerSelect = (savedTraveler) => {
//             // Convert date strings to Date objects if needed
//             const dateOfBirth = savedTraveler.dateOfBirth
//                 ? savedTraveler.dateOfBirth instanceof Date
//                     ? savedTraveler.dateOfBirth
//                     : new Date(savedTraveler.dateOfBirth)
//                 : null;

//             const passportExpiry = savedTraveler.passportExpiry
//                 ? savedTraveler.passportExpiry instanceof Date
//                     ? savedTraveler.passportExpiry
//                     : new Date(savedTraveler.passportExpiry)
//                 : null;

//             // ✅ تحديث جميع البيانات بما فيها الـ Title
//             updateTraveler(travelerNumber, {
//                 title: savedTraveler.title || "",
//                 firstName: savedTraveler.firstName || "",
//                 lastName: savedTraveler.lastName || "",
//                 dateOfBirth: dateOfBirth,
//                 passportNumber: savedTraveler.passportNumber || "",
//                 passportExpiry: passportExpiry,
//                 nationality: savedTraveler.nationality || "",
//             });

//             // ✅ التحقق من العمر بعد الاختيار
//             if (dateOfBirth) {
//                 const ageValidation = validateAge(dateOfBirth, travelerType);
//                 if (!ageValidation.valid) {
//                     setDateError(ageValidation.message);
//                 } else {
//                     setDateError("");
//                 }
//             }
//         };

//         const handleSave = () => {
//             setShowValidation(true);

//             if (!checkAllFieldsValid()) {
//                 sectionRef.current?.scrollIntoView({
//                     behavior: "smooth",
//                     block: "center",
//                 });
//                 onValidationChange?.(false);
//                 return;
//             }

//             updateTraveler(travelerNumber, { isCompleted: true });
//             setIsLocked(true);
//             setAccordionValue("");
//             onValidationChange?.(true);
//         };

//         const handleEdit = () => {
//             updateTraveler(travelerNumber, { isCompleted: false });
//             setIsLocked(false);
//             setAccordionValue("open");
//         };

//         useImperativeHandle(ref, () => ({
//             triggerValidation: () => {
//                 setShowValidation(true);
//                 const isValid = checkAllFieldsValid();
//                 onValidationChange?.(isValid);

//                 if (!isValid) {
//                     setAccordionValue("open");
//                     setIsLocked(false);
//                 }

//                 return isValid;
//             },
//             getData: () => traveler,
//         }));

//         const getTitleOptions = () => {
//             if (travelerType === "Adult") {
//                 return [
//                     { value: "Mr", gender: "Male" },
//                     { value: "Mrs", gender: "Female" },
//                     { value: "Ms", gender: "Female" },
//                 ];
//             }

//             if (travelerType === "Child") {
//                 return [
//                     { value: "Mr", gender: "Male" },
//                     { value: "Miss", gender: "Female" },
//                 ];
//             }

//             if (travelerType === "Infant") {
//                 return [
//                     { value: "Master", gender: "Male" },
//                     { value: "Miss", gender: "Female" },
//                 ];
//             }

//             return [];
//         };

//         const handleTitleChange = (val) => {
//             const selected = getTitleOptions().find((x) => x.value === val);
//             handleFieldChange("title", selected?.value || "");
//             handleFieldChange("gender", selected?.gender || "");
//         };

//         // ✅ حساب الحد الأقصى والأدنى لتاريخ الميلاد بناءً على نوع المسافر
//         const getDateLimits = () => {
//             const today = new Date();
//             let minDate, maxDate;

//             if (travelerType === "Adult") {
//                 // البالغ: 12 سنة فما فوق
//                 maxDate = new Date(
//                     today.getFullYear() - 12,
//                     today.getMonth(),
//                     today.getDate()
//                 );
//                 minDate = new Date(
//                     today.getFullYear() - 100,
//                     today.getMonth(),
//                     today.getDate()
//                 );
//             } else if (travelerType === "Child") {
//                 // الطفل: من 2 إلى أقل من 12 سنة
//                 maxDate = new Date(
//                     today.getFullYear() - 2,
//                     today.getMonth(),
//                     today.getDate()
//                 );
//                 minDate = new Date(
//                     today.getFullYear() - 12,
//                     today.getMonth(),
//                     today.getDate()
//                 );
//             } else if (travelerType === "Infant") {
//                 // الرضيع: أقل من 2 سنة
//                 maxDate = today;
//                 minDate = new Date(
//                     today.getFullYear() - 2,
//                     today.getMonth(),
//                     today.getDate()
//                 );
//             }

//             return { minDate, maxDate };
//         };

//         const { minDate, maxDate } = getDateLimits();

//         if (!traveler) return null;

//         return (
//             <div
//                 ref={sectionRef}
//                 className={cn(
//                     "bg-white dark:bg-gray-800/50 rounded-lg border-2 transition-all",
//                     traveler.isCompleted ? "border-green-500" : "border-border",
//                     showValidation && !traveler.isCompleted && "border-red-500"
//                 )}
//             >
//                 <Accordion
//                     type="single"
//                     collapsible
//                     value={isLocked ? "" : accordionValue}
//                     onValueChange={setAccordionValue}
//                 >
//                     <AccordionItem value="open" className="border-none">
//                         <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer">
//                             <div className="flex items-center gap-4 w-full">
//                                 <div
//                                     className={cn(
//                                         "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
//                                         traveler.isCompleted
//                                             ? "bg-green-500 text-white"
//                                             : "bg-primary-500 text-white"
//                                     )}
//                                 >
//                                     {traveler.isCompleted ? (
//                                         <Check className="w-5 h-5" />
//                                     ) : travelerType === "Infant" ? (
//                                         <Baby className="w-5 h-5" />
//                                     ) : (
//                                         <User className="w-5 h-5" />
//                                     )}
//                                 </div>
//                                 <div className="text-left rtl:text-right flex-1">
//                                     <h3 className="text-lg">
//                                         {traveler.firstName && traveler.lastName
//                                             ? `${traveler.firstName} ${traveler.lastName}`
//                                             : `${p(
//                                                   "booking.traveler"
//                                               )} ${String(
//                                                   travelerNumber
//                                               ).padStart(2, "0")}`}
//                                     </h3>
//                                     <p className="text-sm text-muted-foreground">
//                                         {t(
//                                             `${String(
//                                                 travelerType
//                                             ).toLocaleLowerCase()}`
//                                         )}
//                                     </p>
//                                 </div>
//                                 {traveler.isCompleted && (
//                                     <div className="flex items-center gap-3 mr-2">
//                                         <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleEdit();
//                                             }}
//                                             className="h-8 p-2 cursor-pointer"
//                                         >
//                                             {t("edit")}
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>
//                         </AccordionTrigger>

//                         <AccordionContent className="px-6 pb-6 space-y-6">
//                             {isLoggedIn && (
//                                 <div className="w-full flex justify-end">
//                                     <SavedTravelerSelect
//                                         onSelect={handleSavedTravelerSelect}
//                                     />
//                                 </div>
//                             )}

//                             {/* Title Selection */}
//                             <div className="space-y-3">
//                                 <Label className="flex items-center gap-2">
//                                     {t("title")}{" "}
//                                     <span className="text-red-500">*</span>
//                                 </Label>
//                                 <div className="flex gap-3">
//                                     {getTitleOptions().map((option) => (
//                                         <button
//                                             key={option.value}
//                                             type="button"
//                                             onClick={() =>
//                                                 handleTitleChange(option.value)
//                                             }
//                                             className={cn(
//                                                 "flex-1 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer",
//                                                 showValidation &&
//                                                     !traveler.title &&
//                                                     "border-red-500 bg-red-50 dark:bg-red-950/20",
//                                                 traveler.title === option.value
//                                                     ? "border-accent-500 bg-accent-500 text-white shadow-md"
//                                                     : "border-gray-200 dark:border-gray-700 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/30 dark:hover:text-accent-500"
//                                             )}
//                                         >
//                                             {t(
//                                                 `${String(
//                                                     option.value
//                                                 ).toLocaleLowerCase()}`
//                                             )}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Name Fields */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor={`firstName-${travelerNumber}`}
//                                     >
//                                         {t("first_name")}{" "}
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Input
//                                         id={`firstName-${travelerNumber}`}
//                                         value={traveler.firstName || ""}
//                                         onChange={(e) => {
//                                             let englishOnly =
//                                                 e.target.value.replace(
//                                                     /[^A-Za-z ]/g,
//                                                     ""
//                                                 );

//                                             if (englishOnly.length > 30) {
//                                                 englishOnly = englishOnly.slice(
//                                                     0,
//                                                     30
//                                                 );
//                                             }

//                                             handleFieldChange(
//                                                 "firstName",
//                                                 englishOnly.toUpperCase()
//                                             );
//                                         }}
//                                         placeholder={t(
//                                             "first_name_placeholder"
//                                         )}
//                                         className={cn(
//                                             "h-12 mt-2",
//                                             showValidation &&
//                                                 !traveler.firstName &&
//                                                 "border-red-500 placeholder:text-red-400"
//                                         )}
//                                     />
//                                     <p className="text-xs text-muted-foreground">
//                                         {t("name_text_helper")}
//                                     </p>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor={`lastName-${travelerNumber}`}
//                                     >
//                                         {t("last_name")}{" "}
//                                         <span className="text-red-500">*</span>
//                                     </Label>
//                                     <Input
//                                         id={`lastName-${travelerNumber}`}
//                                         value={traveler.lastName || ""}
//                                         onChange={(e) => {
//                                             let englishOnly =
//                                                 e.target.value.replace(
//                                                     /[^A-Za-z ]/g,
//                                                     ""
//                                                 );

//                                             if (englishOnly.length > 30) {
//                                                 englishOnly = englishOnly.slice(
//                                                     0,
//                                                     30
//                                                 );
//                                             }

//                                             handleFieldChange(
//                                                 "lastName",
//                                                 englishOnly.toUpperCase()
//                                             );
//                                         }}
//                                         placeholder={t("last_name_placeholder")}
//                                         className={cn(
//                                             "h-12 mt-2",
//                                             showValidation &&
//                                                 !traveler.lastName &&
//                                                 "border-red-500 placeholder:text-red-400"
//                                         )}
//                                     />
//                                     <p className="text-xs text-muted-foreground">
//                                         {t("name_text_helper")}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Date of Birth */}
//                             <div className="space-y-2">
//                                 <DateDropdownFields
//                                     label={t("date_of_birth")}
//                                     value={traveler.dateOfBirth}
//                                     onChange={(date) =>
//                                         handleFieldChange("dateOfBirth", date)
//                                     }
//                                     maxDate={maxDate}
//                                     minDate={minDate}
//                                     required
//                                     error={
//                                         showValidation && !traveler.dateOfBirth
//                                     }
//                                     id={`dob-${travelerNumber}`}
//                                 />
//                                 {dateError && (
//                                     <p className="text-sm text-red-500 font-medium">
//                                         {dateError}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Passport Details */}
//                             <div
//                                 className={cn(
//                                     "space-y-4 p-4 rounded-lg border transition-colors",
//                                     "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
//                                 )}
//                             >
//                                 <h4 className="text-sm flex items-center gap-2">
//                                     <svg
//                                         className="w-4 h-4"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                         />
//                                     </svg>
//                                     {t("passport_info")}
//                                 </h4>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <Label
//                                             htmlFor={`passport-${travelerNumber}`}
//                                         >
//                                             {t("passport_number")}{" "}
//                                             <span className="text-red-500">
//                                                 *
//                                             </span>
//                                         </Label>
//                                         <Input
//                                             id={`passport-${travelerNumber}`}
//                                             value={
//                                                 traveler.passportNumber || ""
//                                             }
//                                             onChange={(e) => {
//                                                 const validValue =
//                                                     e.target.value.replace(
//                                                         /[^A-Za-z0-9]/g,
//                                                         ""
//                                                     );
//                                                 handleFieldChange(
//                                                     "passportNumber",
//                                                     validValue.toUpperCase()
//                                                 );
//                                             }}
//                                             placeholder="A12345678"
//                                             className={cn(
//                                                 "h-12 font-mono mt-2",
//                                                 showValidation &&
//                                                     !traveler.passportNumber &&
//                                                     "border-red-500 placeholder:text-red-400"
//                                             )}
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label>
//                                             {t("nationality")}{" "}
//                                             <span className="text-red-500">
//                                                 *
//                                             </span>
//                                         </Label>
//                                         <div
//                                             className={cn(
//                                                 "mt-2",
//                                                 showValidation &&
//                                                     !traveler.nationality &&
//                                                     "ring-1 ring-red-500 rounded-lg"
//                                             )}
//                                         >
//                                             <NationalitySelect
//                                                 value={
//                                                     traveler.nationality || ""
//                                                 }
//                                                 onValueChange={(value) =>
//                                                     handleFieldChange(
//                                                         "nationality",
//                                                         value
//                                                     )
//                                                 }
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <DateDropdownFields
//                                     label={t("passport_expiry_date")}
//                                     value={traveler.passportExpiry}
//                                     onChange={(date) =>
//                                         handleFieldChange(
//                                             "passportExpiry",
//                                             date
//                                         )
//                                     }
//                                     minDate={new Date()}
//                                     required
//                                     error={
//                                         showValidation &&
//                                         !traveler.passportExpiry
//                                     }
//                                     id={`passport-expiry-${travelerNumber}`}
//                                 />
//                             </div>

//                             {/* Save Button */}
//                             <div className="flex justify-end gap-3 pt-4 border-t">
//                                 <Button
//                                     onClick={handleSave}
//                                     className="btn-primary"
//                                 >
//                                     <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
//                                     {t("save_traveler_information")}
//                                 </Button>
//                             </div>
//                         </AccordionContent>
//                     </AccordionItem>
//                 </Accordion>
//             </div>
//         );
//     }
// );

// TravelerInformationSection.displayName = "TravelerInformationSection";

// export default TravelerInformationSection;
