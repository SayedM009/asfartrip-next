import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Users, Plus, Minus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function PassengerClassModal({
  passengers,
  travelClass,
  onPassengersChange,
  onClassChange,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPassengers, setTempPassengers] = useState(passengers);
  const [tempClass, setTempClass] = useState(travelClass);

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  const updatePassengerCount = (type, delta) => {
    setTempPassengers((prev) => {
      const newCount = Math.max(0, prev[type] + delta);

      // Ensure at least 1 adult and max 9 adults
      if (type === "adults") {
        if (newCount < 1) return prev;
        if (newCount > 9) return prev;
      }

      // Limit total passengers to reasonable amount
      const newTotal = Object.keys(prev).reduce((sum, key) => {
        return sum + (key === type ? newCount : prev[key]);
      }, 0);

      if (newTotal > 15) return prev; // Max 15 total passengers

      return {
        ...prev,
        [type]: newCount,
      };
    });
  };

  const handleApply = () => {
    onPassengersChange(tempPassengers);
    onClassChange(tempClass);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempPassengers(passengers);
    setTempClass(travelClass);
    setIsOpen(false);
  };

  const passengerTypes = [
    {
      type: "adults",
      label: "Adults",
      adults_description: "12+ years",
      min: 1,
      max: 9,
    },
    {
      type: "children",
      label: "Children",
      children_description: "2-11 years",
      min: 0,
      max: 8,
    },
    {
      type: "infants",
      label: "Infants",
      infants_description: "Under 2 years",
      min: 0,
      max: 4,
    },
  ];

  const travelClasses = [
    {
      value: "economy",
      label: "economy",
      economy_description: "Standard seating and service",
    },

    {
      value: "business",
      label: "business",
      business_description: "Priority service and comfort",
    },
    {
      value: "first",
      label: "first",
      first_description: "Luxury travel experience",
    },
  ];

  const t = useTranslations("Flight");
  const local = useLocale();
  const condition = local === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="h-12 w-full justify-start"
            aria-label="Passengers & Flight classes button"
          >
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground font-normal">
                {t("passengers.title")}
              </span>
              <span className="text-sm">
                {totalPassengers}{" "}
                {totalPassengers === 1 ? "Passenger" : "Passengers"}
              </span>
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{t("passengers.title")}</span>
          </DialogTitle>
          <DialogDescription>{t("passengers.subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Passenger Selection */}
          <div>
            <Label className="text-sm mb-3 block">
              {t("passengers.passengers")}
            </Label>
            <div className="space-y-4">
              {passengerTypes.map((passengerType) => (
                <div
                  key={passengerType.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium ">
                      {t(`passengers.${passengerType.type}`)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(`passengers.${passengerType.type}_description`)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updatePassengerCount(passengerType.type, -1)
                      }
                      disabled={
                        tempPassengers[passengerType.type] <= passengerType.min
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {tempPassengers[passengerType.type]}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updatePassengerCount(passengerType.type, 1)
                      }
                      disabled={
                        tempPassengers[passengerType.type] >= passengerType.max
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Travel Class Selection */}
          <div>
            <Label className="text-sm mb-3 block">
              {t("passengers.travel_class")}
            </Label>
            <Select value={tempClass} onValueChange={setTempClass}>
              <SelectTrigger className="w-full" dir={condition && "rtl"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {travelClasses.map((cls) => (
                  <SelectItem
                    key={cls.value}
                    value={cls.value}
                    dir={condition && "rtl"}
                  >
                    <div className="flex flex-col items-start">
                      <span className="capitalize">
                        {t(`ticket_class.${cls.label}`)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cls.description}
                        {t(`ticket_class.${cls.value}_description`)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={`flex justify-end space-x-3 pt-4 ${
              condition && "flex-row-reverse justify-start gap-2"
            }`}
          >
            <Button variant="outline" onClick={handleCancel}>
              {t("passengers.cancel")}
            </Button>
            <Button onClick={handleApply}>{t("passengers.apply")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
