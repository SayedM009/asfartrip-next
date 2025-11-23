/**
 * Passenger Type Constants
 * Used for passenger selection and validation
 */

export const PASSENGER_TYPES = {
  ADULTS: 'adults',
  CHILDREN: 'children',
  INFANTS: 'infants'
};

export const PASSENGER_LIMITS = {
  [PASSENGER_TYPES.ADULTS]: {
    min: 1,
    max: 9
  },
  [PASSENGER_TYPES.CHILDREN]: {
    min: 0,
    max: 8
  },
  [PASSENGER_TYPES.INFANTS]: {
    min: 0,
    max: 4
  }
};

export const PASSENGER_AGE_RANGES = {
  [PASSENGER_TYPES.ADULTS]: '12+ years',
  [PASSENGER_TYPES.CHILDREN]: '2-11 years',
  [PASSENGER_TYPES.INFANTS]: '0-2 years'
};

export const PASSENGER_AGE_RANGES_AR = {
  [PASSENGER_TYPES.ADULTS]: '12+ سنة',
  [PASSENGER_TYPES.CHILDREN]: '2-11 سنة',
  [PASSENGER_TYPES.INFANTS]: '0-2 سنة'
};

export const PASSENGER_LABELS = {
  [PASSENGER_TYPES.ADULTS]: 'Adults',
  [PASSENGER_TYPES.CHILDREN]: 'Children',
  [PASSENGER_TYPES.INFANTS]: 'Infants'
};

export const PASSENGER_LABELS_AR = {
  [PASSENGER_TYPES.ADULTS]: 'بالغين',
  [PASSENGER_TYPES.CHILDREN]: 'أطفال',
  [PASSENGER_TYPES.INFANTS]: 'رضع'
};
