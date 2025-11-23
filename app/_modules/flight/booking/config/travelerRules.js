export const travelerAgeRules = {
    Adult: {
        minAge: 12,
        maxAge: 100,
        errorKey: "age_must_be_12_or_above",
    },
    Child: {
        minAge: 2,
        maxAge: 11,
        errorKey: "age_must_be_between_2_and_12",
    },
    Infant: {
        minAge: 0,
        maxAge: 1,
        errorKey: "age_must_be_under_2",
    },
};
