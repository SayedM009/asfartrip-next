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
