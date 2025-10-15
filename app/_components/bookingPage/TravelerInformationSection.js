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
import useBookingStore from "@/app/_store/bookingStore";
import { useTranslations } from "next-intl";

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
        const sectionRef = useRef(null);

        const t = useTranslations("Traveler");
        const p = useTranslations("Flight");

        // Get traveler data from store
        const traveler = useBookingStore((state) =>
            state.getTraveler(travelerNumber)
        );
        const updateTraveler = useBookingStore((state) => state.updateTraveler);

        // Local state for UI control
        const [showValidation, setShowValidation] = useState(false);
        const [accordionValue, setAccordionValue] = useState("");
        const [isLocked, setIsLocked] = useState(false);

        // Initialize accordion state based on completion
        useEffect(() => {
            if (traveler?.isCompleted) {
                setIsLocked(true);
                setAccordionValue("");
            } else {
                setIsLocked(false);
                if (!accordionValue) {
                    setAccordionValue("open");
                }
            }
        }, [traveler?.isCompleted]);

        // Check if all fields are valid
        const checkAllFieldsValid = () => {
            if (!traveler) return false;
            return !!(
                traveler.title &&
                traveler.firstName &&
                traveler.lastName &&
                traveler.dateOfBirth &&
                traveler.passportNumber &&
                traveler.passportExpiry &&
                traveler.nationality
            );
        };

        const handleFieldChange = (field, value) => {
            updateTraveler(travelerNumber, { [field]: value });
        };

        const handleSavedTravelerSelect = (savedTraveler) => {
            // Convert date strings to Date objects if needed
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

            updateTraveler(travelerNumber, {
                title: savedTraveler.title || "",
                firstName: savedTraveler.firstName || "",
                lastName: savedTraveler.lastName || "",
                dateOfBirth: dateOfBirth,
                passportNumber: savedTraveler.passportNumber || "",
                passportExpiry: passportExpiry,
                nationality: savedTraveler.nationality || "",
            });
        };

        const handleSave = () => {
            setShowValidation(true);

            if (!checkAllFieldsValid()) {
                sectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                onValidationChange?.(false);
                return;
            }

            updateTraveler(travelerNumber, { isCompleted: true });
            setIsLocked(true);
            setAccordionValue("");
            onValidationChange?.(true);
        };

        const handleEdit = () => {
            updateTraveler(travelerNumber, { isCompleted: false });
            setIsLocked(false);
            setAccordionValue("open");
        };

        useImperativeHandle(ref, () => ({
            triggerValidation: () => {
                setShowValidation(true);
                const isValid = checkAllFieldsValid();
                onValidationChange?.(isValid);

                if (!isValid) {
                    setAccordionValue("open");
                    setIsLocked(false);
                }

                return isValid;
            },
            getData: () => traveler,
        }));

        if (!traveler) return null;

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
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                        traveler.isCompleted
                                            ? "bg-green-500 text-white"
                                            : "bg-primary-500 text-white"
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
                                            ).toLocaleLowerCase()}`
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
                                                handleEdit();
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
                            {isLoggedIn && (
                                <div className="w-full flex justify-end">
                                    <SavedTravelerSelect
                                        onSelect={handleSavedTravelerSelect}
                                    />
                                </div>
                            )}

                            {/* Title Selection */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    {t("title")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-3">
                                    {[
                                        { value: "mr", label: "mr" },
                                        { value: "mrs", label: "mrs" },
                                        { value: "miss", label: "miss" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                handleFieldChange(
                                                    "title",
                                                    option.value
                                                )
                                            }
                                            className={cn(
                                                "flex-1 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer",
                                                showValidation &&
                                                    !traveler.title &&
                                                    "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                traveler.title === option.value
                                                    ? "border-accent-500 bg-accent-500 text-white shadow-md"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/30 dark:hover:text-accent-500"
                                            )}
                                        >
                                            {t(`${option.label}`)}
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
                                        {t("first_name")}{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`firstName-${travelerNumber}`}
                                        value={traveler.firstName || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "firstName",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder={t(
                                            "first_name_placeholder"
                                        )}
                                        className={cn(
                                            "h-12 mt-2",
                                            showValidation &&
                                                !traveler.firstName &&
                                                "border-red-500 placeholder:text-red-400"
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t("name_text_helper")}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`lastName-${travelerNumber}`}
                                    >
                                        {t("last_name")}{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={`lastName-${travelerNumber}`}
                                        value={traveler.lastName || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "lastName",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder={t("last_name_placeholder")}
                                        className={cn(
                                            "h-12 mt-2",
                                            showValidation &&
                                                !traveler.lastName &&
                                                "border-red-500 placeholder:text-red-400"
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t("name_text_helper")}
                                    </p>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <DateDropdownFields
                                label={t("date_of_birth")}
                                value={traveler.dateOfBirth}
                                onChange={(date) =>
                                    handleFieldChange("dateOfBirth", date)
                                }
                                maxDate={new Date()}
                                required
                                error={showValidation && !traveler.dateOfBirth}
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
                                    {t("passport_info")}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`passport-${travelerNumber}`}
                                        >
                                            {t("passport_number")}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id={`passport-${travelerNumber}`}
                                            value={
                                                traveler.passportNumber || ""
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "passportNumber",
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                            placeholder="A12345678"
                                            className={cn(
                                                "h-12 font-mono mt-2",
                                                showValidation &&
                                                    !traveler.passportNumber &&
                                                    "border-red-500 placeholder:text-red-400"
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            {t("nationality")}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div
                                            className={cn(
                                                "mt-2",
                                                showValidation &&
                                                    !traveler.nationality &&
                                                    "ring-1 ring-red-500 rounded-lg"
                                            )}
                                        >
                                            <NationalitySelect
                                                value={
                                                    traveler.nationality || ""
                                                }
                                                onValueChange={(value) =>
                                                    handleFieldChange(
                                                        "nationality",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DateDropdownFields
                                    label={t("passport_expiry_date")}
                                    value={traveler.passportExpiry}
                                    onChange={(date) =>
                                        handleFieldChange(
                                            "passportExpiry",
                                            date
                                        )
                                    }
                                    minDate={new Date()}
                                    required
                                    error={
                                        showValidation &&
                                        !traveler.passportExpiry
                                    }
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
                                    {t("save_traveler_information")}
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
