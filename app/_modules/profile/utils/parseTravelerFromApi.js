export function parseTravelerFromApi(apiTraveler = {}) {
    let parsed = {};
    try {
        parsed = apiTraveler.json_list ? JSON.parse(apiTraveler.json_list) : {};
    } catch (e) {
        parsed = {};
    }

    return {
        id: apiTraveler.id,
        fk_user_id: apiTraveler.fk_user_id,
        user_type: apiTraveler.user_type,
        title: parsed.title || "",
        firstName: parsed.first_name || "",
        lastName: parsed.last_name || "",
        dateOfBirth: parsed.dob || "",
        passportNumber: parsed.passport_no || "",
        nationality: parsed.passport_country || "",
        passportExpiry: parsed.passport_expiry || "",
    };
}