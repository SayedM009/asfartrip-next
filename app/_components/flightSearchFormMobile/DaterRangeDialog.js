import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

// Helper functions for date formatting
const formatDisplayDate = (date) => {
  if (!date) return "";
  try {
    console.log(
      new Date(date).toLocaleDateString(langs[locale], {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
    return new Date(date).toLocaleDateString(langs[locale], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
};

function DaterRangeDialog({
  tripType,
  departDate,
  returnDate,
  onDepartDateChange,
  onReturnDateChange,
  children,
}) {
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState({ from: undefined, to: undefined });

  return (
    <Dialog>
      <DialogTrigger className="text-primary-800 w-full flex items-center justify-between py-3 border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded transition-colors">
        {tripType === "roundtrip" ? (
          <>
            <div>
              <div className="font-semibold text-gray-900">
                {departDate ? formatDisplayDate(range.from) : "Departure date"}
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500">
                {departDate && returnDate
                  ? calculateDaysBetween(range.from, range.to)
                  : "0 days"}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {returnDate ? formatDisplayDate(range.to) : "Retrun date"}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="font-semibold text-gray-900">
              {departDate ? formatDisplayDate(date) : "Choose Date"}
            </div>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="h-full w-full max-w-none overflow-y-scroll ">
        <DialogHeader>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Calendar
          mode={tripType === "roundtrip" ? "range" : "single"}
          selected={date}
          onSelect={(e) => (tripType === "trip" ? setRange(e) : setDate(e))}
          className="rounded-lg w-full"
          numberOfMonths={12}
        />
        <DialogFooter className="border-t w-full  sticky bottom-0">
          <button className="w-full py-2 bg-accent-600 text-white rounded-lg">
            Apply
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DaterRangeDialog;
