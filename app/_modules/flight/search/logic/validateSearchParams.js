import { validatePassengers } from "./validatePassengers";

export function validateSearchParams({
  departure,
  destination,
  tripType,
  departDate,
  range,
  ADT,
  CHD,
  INF,
}) {
  const errors = [];

  if (!departure) errors.push("MISSING_DEPARTURE");
  if (!destination) errors.push("MISSING_DESTINATION");

  if (
    departure &&
    destination &&
    departure.city &&
    destination.city &&
    departure.city === destination.city
  ) {
    errors.push("SAME_CITY");
  }

  if (tripType === "oneway" && !departDate) {
    errors.push("MISSING_DEPART_DATE");
  }

  if (tripType === "roundtrip") {
    if (!range?.from || !range?.to) {
      errors.push("MISSING_RETURN_RANGE");
    }
  }

  const paxValidation = validatePassengers({ ADT, CHD, INF });
  if (!paxValidation.valid) {
    errors.push(...paxValidation.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
