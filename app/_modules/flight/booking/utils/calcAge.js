export function calcAge(dob) {
    if (!dob) return null;

    const birthDate = dob instanceof Date ? dob : new Date(dob);
    if (isNaN(birthDate)) return null;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // لو الشهر الحالي لسه مجاش
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
