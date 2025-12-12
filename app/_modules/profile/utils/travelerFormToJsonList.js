export function travelerFormToJsonList(formTraveler = {}) {
    return {
        title: formTraveler.title || "",
        first_name: formTraveler.firstName || "",
        last_name: formTraveler.lastName || "",
        dob: formTraveler.dateOfBirth || "",
        passport_no: formTraveler.passportNumber || "",
        passport_country: formTraveler.nationality || "",
        passport_expiry: formTraveler.passportExpiry || "",
    };
}