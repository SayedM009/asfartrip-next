import { PASSENGER_RULES } from "./passengerRules";

export function validatePassengers({ ADT = 1, CHD = 0, INF = 0 }) {
  const errors = [];

  const adults = Number(ADT) || 0;
  const children = Number(CHD) || 0;
  const infants = Number(INF) || 0;

  const seated = adults + children;

  if (seated > PASSENGER_RULES.MAX_SEATED_PAX) {
    errors.push("MAX_SEATED_PAX_EXCEEDED");
  }

  if (infants > adults) {
    errors.push("INFANTS_MORE_THAN_ADULTS");
  }

  if (adults === 0 && infants > 0) {
    errors.push("INFANTS_WITHOUT_ADULTS");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
