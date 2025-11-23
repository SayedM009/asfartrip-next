/**
 * Trip Type Constants
 * Used across the flight search module
 */

export const TRIP_TYPES = {
  ONE_WAY: 'oneWay',
  ROUND_TRIP: 'roundTrip',
  MULTI_CITY: 'multiCity'
};

export const TRIP_TYPE_LABELS = {
  [TRIP_TYPES.ONE_WAY]: 'One Way',
  [TRIP_TYPES.ROUND_TRIP]: 'Round Trip',
  [TRIP_TYPES.MULTI_CITY]: 'Multi City'
};

export const TRIP_TYPE_LABELS_AR = {
  [TRIP_TYPES.ONE_WAY]: 'ذهاب فقط',
  [TRIP_TYPES.ROUND_TRIP]: 'ذهاب وعودة',
  [TRIP_TYPES.MULTI_CITY]: 'متعدد المدن'
};
