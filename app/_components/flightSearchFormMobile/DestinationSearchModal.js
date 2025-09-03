import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { X, Search, MapPin, Plane, Building2 } from "lucide-react";

export function DestinationSearchModal({
  isOpen,
  onOpenChange,
  onSelect,
  currentValue,
  title,
  children,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [multipleDestinations, setMultipleDestinations] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Popular destinations grouped by region
  const popularCities = [
    "Cairo",
    "Manila",
    "Sharjah",
    "London",
    "Dubai",
    "Jeddah",
  ];

  const destinationsByRegion = {
    Asia: ["Dubai", "Abu Dhabi", "Sharjah", "Kochi", "Kozhikode", "Manila"],
    Europe: ["London", "Madrid", "Milan", "Tbilisi", "Paris", "Amsterdam"],
    "North America": [
      "New York",
      "Los Angeles",
      "Miami",
      "Chicago",
      "San Francisco",
      "Toronto",
    ],
    "South America": [
      "Sao Paulo",
      "Rio de Janeiro",
      "Bogota",
      "Buenos Aires",
      "Santiago",
      "Lima",
    ],
    Africa: [
      "Cairo",
      "Giza Governorate",
      "Alexandria",
      "Casablanca",
      "Tunis",
      "Algiers",
    ],
  };

  // Mock search function - in real app this would call an API
  const searchDestinations = (query) => {
    const mockResults = [
      {
        code: "CAI",
        name: "Cairo International Airport",
        city: "Cairo",
        country: "Egypt",
        type: "airport",
      },
      {
        code: "CAI",
        name: "Cairo (All airports)",
        city: "Cairo",
        country: "Egypt",
        type: "city",
      },
      {
        code: "CCE",
        name: "Capital International Airport",
        city: "Cairo",
        country: "Egypt",
        type: "airport",
      },
      {
        code: "CIR",
        name: "Cairo Governorate",
        city: "Cairo",
        country: "Egypt",
        type: "region",
      },
      {
        code: "CIR",
        name: "Cairo",
        city: "Cairo",
        country: "United States",
        type: "city",
      },
      {
        code: "PAH",
        name: "Barkley Regional Airport",
        city: "Paducah",
        country: "United States",
        type: "airport",
        distance: "56 km",
      },
      {
        code: "CGI",
        name: "Cape Girardeau Regional Airport",
        city: "Cape Girardeau",
        country: "United States",
        type: "airport",
        distance: "42 km",
      },
      {
        code: "MWA",
        name: "Veterans Airport of Southern Illinois",
        city: "Marion",
        country: "United States",
        type: "airport",
        distance: "83 km",
      },
      {
        code: "CNS",
        name: "Cairns (All airports)",
        city: "Cairns",
        country: "Australia",
        type: "city",
      },
      {
        code: "CNS",
        name: "Cairns Airport",
        city: "Cairns",
        country: "Australia",
        type: "airport",
      },
      {
        code: "MXQ",
        name: "Cairu (All airports)",
        city: "Cairu",
        country: "Brazil",
        type: "city",
      },
      {
        code: "MXQ",
        name: "Lorenzo Airport",
        city: "Cairu",
        country: "Brazil",
        type: "airport",
      },
      {
        code: "CGN",
        name: "Cairns North",
        city: "Cairns",
        country: "Australia",
        type: "region",
      },
    ];

    if (!query.trim()) return [];
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchDestinations(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleDestinationSelect = (destination) => {
    onSelect(destination);
    onOpenChange(false);
    setSearchQuery("");
  };

  const handleModalClose = (open) => {
    onOpenChange(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  const renderSearchResults = () => {
    if (!searchQuery.trim()) return null;

    if (searchResults.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try searching for a different city or airport
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto">
        {searchResults.map((result, index) => (
          <button
            key={index}
            onClick={() => handleDestinationSelect(result.city)}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
            aria-label={`Select ${result.name} in ${result.country}${
              result.distance ? `, ${result.distance} away` : ""
            }`}
          >
            <div className="flex-shrink-0">
              {result.type === "airport" ? (
                <Plane className="h-5 w-5 text-blue-600" aria-hidden="true" />
              ) : result.type === "city" ? (
                <Building2
                  className="h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
              ) : (
                <MapPin className="h-5 w-5 text-green-600" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-blue-600">
                  {result.code}
                </span>
                <span className="text-gray-900">{result.name}</span>
              </div>
              <div className="text-sm text-gray-500">{result.country}</div>
            </div>
            {result.distance && (
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-400">Near</div>
                <div className="text-sm text-gray-600">{result.distance}</div>
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderPopularDestinations = () => {
    if (searchQuery.trim()) return null;

    return (
      <div className="flex-1 overflow-y-auto">
        {/* Popular Cities */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Popular cities</h3>
          <div className="grid grid-cols-3 gap-3">
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => handleDestinationSelect(city)}
                className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-3 py-2 text-sm font-medium text-blue-600"
                aria-label={`Select ${city}`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations by Region */}
        {Object.entries(destinationsByRegion).map(([region, cities]) => (
          <div key={region} className="p-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">{region}</h3>
            <div className="grid grid-cols-3 gap-3">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleDestinationSelect(city)}
                  className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-3 py-2 text-sm font-medium text-blue-600"
                  aria-label={`Select ${city} in ${region}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none border-0 inset-0 fixed">
        <div className="flex flex-col h-full bg-white">
          {/* Accessible Dialog Header - Hidden visually but available to screen readers */}
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Search and select your{" "}
              {title.toLowerCase().includes("departure")
                ? "departure"
                : "destination"}{" "}
              city or airport. You can search by city name, airport name, or
              airport code.
            </DialogDescription>
          </DialogHeader>

          {/* Visual Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleModalClose(false)}
              className="h-8 w-8"
              aria-label="Close destination search"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Multiple departure cities
              </span>
              <Switch
                checked={multipleDestinations}
                onCheckedChange={setMultipleDestinations}
                aria-label="Enable multiple departure cities"
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="City or airport"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-0 rounded-lg"
                autoFocus
                aria-label="Search for city or airport"
              />
            </div>
          </div>

          {/* Content */}
          {renderSearchResults()}
          {renderPopularDestinations()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
