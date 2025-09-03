"use client";
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
import { Switch } from "../ui/switch";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function DateRangeModal({
  tripType,
  departDate,
  returnDate,
  onDepartDateChange,
  onReturnDateChange,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDepartDate, setTempDepartDate] = useState(departDate);
  const [tempReturnDate, setTempReturnDate] = useState(returnDate || "");
  const [nonstop, setNonstop] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // September 2025

  // Generate 12 months starting from September 2025
  const generateMonths = () => {
    const months = [];
    const startDate = new Date(2025, 8); // September 2025

    for (let i = 0; i < 12; i++) {
      const month = new Date(startDate);
      month.setMonth(startDate.getMonth() + i);
      months.push({
        month: month.getMonth(),
        year: month.getFullYear(),
      });
    }

    return months;
  };

  const monthsToShow = generateMonths();

  // Mock price data for calendar days
  const getDayData = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: 0, isSelectable: false });
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const isToday = day === 5 && month === 8; // Mock today as Sep 5
      const isSelected =
        tempDepartDate === fullDate || tempReturnDate === fullDate;

      days.push({
        date: day,
        isToday,
        isSelected,
        isSelectable: true,
        fullDate,
      });
    }

    return days;
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getMonthName = (month, year) => {
    return new Date(year, month).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleDateSelect = (fullDate) => {
    if (tripType === "oneway") {
      setTempDepartDate(fullDate);
    } else {
      // Round trip logic
      if (!tempDepartDate || (tempDepartDate && tempReturnDate)) {
        // First selection or reset - select departure date
        setTempDepartDate(fullDate);
        setTempReturnDate("");
      } else if (tempDepartDate && !tempReturnDate) {
        // Second selection - select return date
        const depDate = new Date(tempDepartDate);
        const selDate = new Date(fullDate);

        if (selDate > depDate) {
          setTempReturnDate(fullDate);
        } else if (selDate.getTime() === depDate.getTime()) {
          // Same date selected - keep as departure only
          return;
        } else {
          // Earlier date selected - make it the new departure
          setTempDepartDate(fullDate);
          setTempReturnDate("");
        }
      }
    }
  };

  // Helper function to check if date is in selected range
  const isInRange = (fullDate) => {
    if (tripType !== "roundtrip" || !tempDepartDate || !tempReturnDate)
      return false;

    const date = new Date(fullDate);
    const startDate = new Date(tempDepartDate);
    const endDate = new Date(tempReturnDate);

    return date > startDate && date < endDate;
  };

  const handleApply = () => {
    onDepartDateChange(tempDepartDate);
    if (onReturnDateChange && tripType === "roundtrip") {
      onReturnDateChange(tempReturnDate);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDepartDate(departDate);
    setTempReturnDate(returnDate || "");
    setIsOpen(false);
  };

  const renderCalendar = (month, year) => {
    const days = getDayData(month, year);
    const monthName = getMonthName(month, year);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-center mb-4">{monthName}</h3>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="relative">
              {day.date > 0 && day.isSelectable ? (
                <button
                  onClick={() => handleDateSelect(day.fullDate)}
                  className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                    day.isSelected
                      ? "bg-blue-600 text-white"
                      : isInRange(day.fullDate)
                      ? "bg-blue-50 text-blue-600"
                      : day.isToday
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  <span className={day.isSelected ? "font-semibold" : ""}>
                    {day.date}
                  </span>
                </button>
              ) : (
                <div className="w-full aspect-square"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none border-0 inset-0 fixed">
        <div className="flex flex-col h-full bg-white">
          {/* Accessible Dialog Header - Hidden visually but available to screen readers */}
          <DialogHeader className="sr-only">
            <DialogTitle>Select Dates</DialogTitle>
            <DialogDescription>
              Choose your{" "}
              {tripType === "roundtrip" ? "departure and return" : "departure"}{" "}
              date{tripType === "roundtrip" ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>

          {/* Visual Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
              aria-label="Close date selection"
            >
              <X className="h-5 w-5" />
            </Button>

            <h1 className="text-lg font-semibold">Select Dates</h1>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Nonstop</span>
              <Switch
                checked={nonstop}
                onCheckedChange={setNonstop}
                aria-label="Enable nonstop flights only"
              />
            </div>
          </div>

          {/* Calendar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {monthsToShow.map((monthData, index) => (
              <div key={`${monthData.year}-${monthData.month}`}>
                {renderCalendar(monthData.month, monthData.year)}
              </div>
            ))}
          </div>

          {/* Bottom Section with Selected Dates */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Local time</div>
                <div className="font-semibold text-gray-900">
                  {tempDepartDate
                    ? formatDisplayDate(tempDepartDate)
                    : "Select date"}
                </div>
              </div>

              {tripType === "roundtrip" && (
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Local time</div>
                  <div className="font-semibold text-gray-900">
                    {tempReturnDate
                      ? formatDisplayDate(tempReturnDate)
                      : "Select date"}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleApply}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              disabled={
                !tempDepartDate || (tripType === "roundtrip" && !tempReturnDate)
              }
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
