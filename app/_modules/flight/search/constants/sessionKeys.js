export const SESSION_KEYS = {
    TRIP_TYPE: "tripType",
    DEPARTURE: "departure",
    DESTINATION: "destination",
    DEPARTURE_DATE: "departureDate",
    RANGE_DATE: "rangeDate",
    PASSENGERS: "flightPassengers",
    TRAVEL_CLASS: "travelClass",
};

export const DEFAULT_VALUES = {
    TRIP_TYPE: "roundtrip",
    PASSENGERS: { adults: 1, children: 0, infants: 0 },
    TRAVEL_CLASS: "economy", // Lowercase to match UI values
};
