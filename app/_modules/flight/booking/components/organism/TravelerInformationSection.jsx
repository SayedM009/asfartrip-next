"use client";

import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { Baby, User, Check, Save } from "lucide-react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { useTravelerSection } from "../../hooks/useTravelerSection";
import SavedTravelerSelect from "../molecule/SavedTravelerSelect";
import TravelerBasicFields from "@/app/_components/TravelerBasicFields";

const TravelerInformationSection = forwardRef(
    (
        {
            travelerNumber,
            travelerType,
            isLoggedIn = false,
            withAccordion = true,
        },
        ref
    ) => {
        const t = useTranslations("Traveler");
        const p = useTranslations("Flight");

        const {
            sectionRef,
            traveler,
            showValidation,
            accordionValue,
            isLocked,
            ageError,
            minDate,
            maxDate,
            setAccordionValue,
            handleFieldChange,
            handleSavedTravelerSelect,
            saveTraveler,
            api,
        } = useTravelerSection(travelerNumber, travelerType, withAccordion);

        useImperativeHandle(ref, () => api);

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
                        <AccordionTrigger className="px-6 py-4">
                            <div className="flex items-center gap-4 w-full">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center",
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

                                <div className="flex-1 text-left rtl:text-right">
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
                                        {t(`${travelerType.toLowerCase()}`)}
                                    </p>
                                </div>

                                {traveler.isCompleted && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAccordionValue("open");
                                        }}
                                    >
                                        {t("edit")}
                                    </Button>
                                )}
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-6 pb-6 space-y-6">
                            {fields}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    className="btn-primary"
                                    onClick={saveTraveler}
                                >
                                    <Save className="w-4 h-4" />
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
