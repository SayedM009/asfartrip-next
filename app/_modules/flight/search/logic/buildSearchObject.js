export function buildSearchObject({
  departure,
  destination,
  tripType,
  departDateStr,
  returnFromStr,
  returnToStr,
  passengers,
  travelClass,
}) {
  if (!departure || !destination) {
    throw new Error("Missing departure or destination");
  }

  const base = {
    origin: departure.label_code,
    destination: destination.label_code,
    depart_date: departDateStr,
    ADT: passengers.adults,
    CHD: passengers.children,
    INF: passengers.infants,
    class: travelClass,
  };

  if (tripType === "oneway") {
    return {
      ...base,
      type: "O",
    };
  }

  if (tripType === "roundtrip") {
    return {
      ...base,
      type: "R",
      return_date: returnToStr,
    };
  }

  throw new Error("Invalid tripType");
}
