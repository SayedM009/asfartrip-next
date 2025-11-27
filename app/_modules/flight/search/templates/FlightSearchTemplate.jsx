import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useFlightSearchState } from "../hooks/state/useFlightSearchState";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { TripTypeSelector } from "../molecules/selectors/TripTypeSelector";
import { AirportSearchField } from "../organisms/AirportSearchField";
import { DateSelector } from "../organisms/DateSelector";
import { PassengerSelector } from "../organisms/PassengerSelector";
import { SearchButton } from "../atoms/buttons/SearchButton";
export const FlightSearchTemplate = ({ 
  variant = "desktop", 
  isLabel = true,
  className 
}) => {
  const searchState = useFlightSearchState();
  
  // Use existing hook for search execution (refactored to accept state)
  const { handleSearch, isSearching } = useFlightSearch({
    ...searchState
  });
  
  return (
    <Card className={cn("border-none shadow-none bg-transparent", className)}>
      <CardContent className={cn(
        "p-0",
        variant === "desktop" && "space-y-4",
        variant === "mobile" && "space-y-4"
      )}>
        <div className={cn(
          "flex",
          variant === "mobile" ? "justify-center" : "justify-start"
        )}>
          <TripTypeSelector 
            tripType={searchState.tripType} 
            onChange={searchState.setTripType} 
          />
        </div>
        
        <div className={cn(
          "flex gap-3 items-end",
          variant === "mobile" && "flex-col items-stretch gap-4"
        )}>
          <AirportSearchField
            departure={searchState.departure}
            destination={searchState.destination}
            onDepartureChange={searchState.setDeparture}
            onDestinationChange={searchState.setDestination}
            isLabel={isLabel}
            variant={variant}
            className="flex-[2]"
          />
          
          <DateSelector
            tripType={searchState.tripType}
            departDate={searchState.departDate}
            range={searchState.range}
            onDepartDateChange={searchState.setDepartDate}
            onRangeChange={searchState.setRange}
            isLabel={isLabel}
            variant={variant}
            className="flex-1"
          />
          
          <PassengerSelector
            passengers={searchState.passengers}
            travelClass={searchState.travelClass}
            onPassengersChange={searchState.setPassengers}
            onClassChange={searchState.setTravelClass}
            isLabel={isLabel}
            variant={variant}
            className="flex-1"
          />
          
          <div className={cn(
            variant === "mobile" ? "mt-2" : "mb-[2px]"
          )}>
            <SearchButton 
              onClick={handleSearch} 
              loading={isSearching}
              expanded={variant === "mobile"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};