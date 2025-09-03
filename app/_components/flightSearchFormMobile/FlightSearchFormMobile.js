"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { PassengerClassModal } from "./PassengerClassModal";
import { DateRangeModal } from "./DateRangeModal";
import { DestinationSearchModal } from "./DestinationSearchModal";
import { User, Users, Baby, RefreshCcw } from "lucide-react";
import { useLocale } from "next-intl";
import DaterRangeDialog from "./DaterRangeDialog";

const langs = {
  en: "en-US",
  ar: "ar-AE",
};

export function FlightSearchForm() {
  const [tripType, setTripType] = useState("roundtrip");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState("economy");
  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const locale = useLocale();
  console.log(locale);
  const swapCities = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 1000);
  };

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

  const calculateDaysBetween = () => {
    if (!start || !end) return "";
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    } catch {
      return "";
    }
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  const getClassDisplayName = (className) => {
    switch (className) {
      case "economy":
        return "Economy";
      case "premium":
        return "Premium Economy";
      case "business":
        return "Business";
      case "first":
        return "First Class";
      default:
        return "Economy";
    }
  };

  return (
    <div className=" from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800  ">
      <div className="max-w-md mx-auto">
        {/* Service Navigation - Only show on larger screens */}
        {/* <div className="hidden lg:block mb-8">
          <ServiceNavigation />
        </div> */}

        {/* Main Search Card */}
        <Card className="shadow-lg bg-white backdrop-blur-sm">
          <CardContent className="px-4 space-y-2 pt-4 pb-1">
            {/* Trip Type Tabs with Sliding Animation */}
            <div className="relative bg-secondary-200 rounded-lg p-1 h-10">
              {/* Sliding background */}
              <div
                className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-out"
                style={{
                  left:
                    tripType === "oneway"
                      ? "4px"
                      : tripType === "roundtrip"
                      ? "calc(50% + 2px)"
                      : "calc(66.66% + 2px)",
                  width: "calc(50% - 6px)",
                }}
              />

              {/* Tab buttons */}
              <div className="relative grid grid-cols-2 h-full ">
                <button
                  onClick={() => setTripType("oneway")}
                  className={`text-sm font-semibold transition-colors duration-200 rounded-md ${
                    tripType === "oneway" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  One-way
                </button>
                <button
                  onClick={() => setTripType("roundtrip")}
                  className={`text-sm font-semibold transition-colors duration-200 rounded-md ${
                    tripType === "roundtrip" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Round trip
                </button>
                {/* Multi cities */}
                {/* <button
                  onClick={() => setTripType("multicity")}
                  className={`text-sm font-medium transition-colors duration-200 rounded-md ${
                    tripType === "multicity" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Multi-city
                </button> */}
              </div>
            </div>

            {/* Cities Section */}
            <div className="m-0">
              {/* From and To with Swap Button */}
              <div className="relative">
                <div className="flex items-center justify-between py-2">
                  {/* From City - Clickable */}
                  <DestinationSearchModal
                    isOpen={departureModalOpen}
                    onOpenChange={setDepartureModalOpen}
                    onSelect={setDeparture}
                    currentValue={departure}
                    title="Select departure city"
                  >
                    <div
                      className="flex-1 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                      onClick={() => setDepartureModalOpen(true)}
                    >
                      <div className="text-lg font-semibold text-gray-900">
                        {departure || "New York"}
                      </div>
                      <div className="text-sm text-primary-900">
                        All airports
                      </div>
                    </div>
                  </DestinationSearchModal>

                  {/* Swap Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={swapCities}
                    className="mx-3 h-8 w-8 rounded-full hover:bg-blue-50 border-1 border-gray-300 relative"
                  >
                    {/* <PlaneIcon
                      className=" text-primary-900 rotate-45"
                      size={32}
                    /> */}
                    <RefreshCcw
                      size={60}
                      className={`cursor-pointer text-primary-900 transition-transform ${
                        spinning ? "animate-spin duration-75" : ""
                      }`}
                    />
                  </Button>

                  {/* To City - Clickable */}
                  <DestinationSearchModal
                    isOpen={destinationModalOpen}
                    onOpenChange={setDestinationModalOpen}
                    onSelect={setDestination}
                    currentValue={destination}
                    title="Select destination city"
                  >
                    <div
                      className="flex-1 text-right cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                      onClick={() => setDestinationModalOpen(true)}
                    >
                      <div className="text-lg font-semibold text-gray-900">
                        {destination || "London"}
                      </div>
                      <div className="text-sm text-gray-500">All airports</div>
                    </div>
                  </DestinationSearchModal>
                </div>
              </div>

              {/* Hidden inputs for actual functionality */}
              <div className="sr-only">
                <Input
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  placeholder="From"
                />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>

            {/* Date Section - Clickable */}
            <DaterRangeDialog
              tripType={tripType}
              departDate={departDate}
              returnDate={returnDate}
              onDepartDateChange={setDepartDate}
              onReturnDateChange={setReturnDate}
            />
            <DateRangeModal
              tripType={tripType}
              departDate={departDate}
              returnDate={returnDate}
              onDepartDateChange={setDepartDate}
              onReturnDateChange={setReturnDate}
            >
              <div className="flex items-center justify-between py-3 border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded transition-colors">
                {tripType === "roundtrip" ? (
                  <>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {departDate
                          ? formatDisplayDate(departDate)
                          : "Fri, Sep 5"}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-500">
                        {departDate && returnDate
                          ? calculateDaysBetween(departDate, returnDate)
                          : "4 days"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {returnDate
                          ? formatDisplayDate(returnDate)
                          : "Mon, Sep 8"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="font-semibold text-gray-900">
                      {departDate
                        ? formatDisplayDate(departDate)
                        : "Choose Date"}
                    </div>
                  </div>
                )}
              </div>
            </DateRangeModal>

            {/* Class and Passengers - Clickable */}
            <PassengerClassModal
              passengers={passengers}
              travelClass={travelClass}
              onPassengersChange={setPassengers}
              onClassChange={setTravelClass}
            >
              <div className="flex items-center justify-between py-3 border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded transition-colors">
                <div className="flex-1">
                  <div className="text-sm text-primary-900 font-semibold">
                    {getClassDisplayName(travelClass)}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Adults */}
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-primary-500">
                      {passengers.adults}
                    </span>
                  </div>
                  {/* Children */}
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-primary-500">
                      {passengers.children}
                    </span>
                  </div>
                  {/* Infants */}
                  <div className="flex items-center space-x-1">
                    <Baby className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-primary-500">
                      {passengers.infants}
                    </span>
                  </div>
                </div>
              </div>
            </PassengerClassModal>

            {/* Search Button */}
            <Button className="w-full h-10 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded cursor-pointer transition-colors">
              {/* <Button className="w-full h-10 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded cursor-pointer transition-colors"> */}
              Search
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
