import React from "react";
import { FlightSearchTemplate } from "./FlightSearchTemplate";
export const DesktopFlightSearch = ({ isLabel = true }) => {
  return (
    <div className="bg-background rounded-xl shadow-sm border p-6">
      <FlightSearchTemplate variant="desktop" isLabel={isLabel} />
    </div>
  );
};