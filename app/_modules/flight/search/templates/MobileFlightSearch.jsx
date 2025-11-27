import React from "react";
import { FlightSearchTemplate } from "./FlightSearchTemplate";
export const MobileFlightSearch = () => {
  return (
    <div className="bg-background rounded-xl shadow-sm border p-4">
      <FlightSearchTemplate variant="mobile" isLabel={true} />
    </div>
  );
};