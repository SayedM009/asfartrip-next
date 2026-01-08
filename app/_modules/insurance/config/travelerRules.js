export const travelerAgeRules = {
    Adult: {
        minAge: 17,
        maxAge: 65,
        errorKey: "age_must_be_17_to_65",
    },
    Child: {
        minAge: 0,
        maxAge: 16,
        errorKey: "age_must_be_0_to_16",
    },
    Senior: {
        minAge: 66,
        maxAge: 75,
        errorKey: "age_must_be_66_to_75",
    },
};
