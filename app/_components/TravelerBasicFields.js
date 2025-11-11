import { useTranslations } from "next-intl";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { DateDropdownFields } from "./flightComponents/bookingPage/DateDropdownFields";
import { NationalitySelect } from "./flightComponents/bookingPage/NationalitySelect";
import { cn } from "@/lib/utils";

function calcAge(dob) {
    if (!dob) return null;
    const d = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
}

function deriveTitle(gender, dob) {
    const age = calcAge(dob);
    if (!gender || age === null) return "";

    if (age >= 12) return gender === "Male" ? "Mr" : "Mrs";
    if (age >= 2) return gender === "Male" ? "Master" : "Miss";
    return gender === "Male" ? "Master" : "Miss";
}

function genderFromTitle(title = "") {
    if (!title) return "";
    const t = title.toLowerCase();

    // ✅ ترتيب الفحص مهم جداً!
    // Mr و Mrs و Master يحتوون على "mr"، لذلك نفحص بالترتيب الصحيح
    if (t === "mrs" || t === "ms" || t === "miss") return "Female";
    if (t === "mr" || t === "master" || t === "mstr") return "Male";

    return "";
}

export default function TravelerBasicFields({
    traveler = {},
    showValidation = false,
    minDob,
    maxDob,
    onFieldChange,
    isLoggedIn = false,
    SavedTravelerSlot,
    ageError = "",
}) {
    const t = useTranslations("Traveler");

    const currentGender = genderFromTitle(traveler.title) || "";

    const handleGenderChange = (newGender) => {
        if (!traveler.dateOfBirth) {
            const defaultTitle = newGender === "Male" ? "Mr" : "Mrs";
            onFieldChange?.("title", defaultTitle);
            return;
        }

        const newTitle = deriveTitle(newGender, traveler.dateOfBirth);

        if (newTitle) {
            onFieldChange?.("title", newTitle);
        }
    };

    const handleDobChange = (newDob) => {
        onFieldChange?.("dateOfBirth", newDob || null);

        if (currentGender && newDob) {
            const newTitle = deriveTitle(currentGender, newDob);
            if (newTitle && newTitle !== traveler.title) {
                onFieldChange?.("title", newTitle);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Saved travelers slot */}
            {isLoggedIn && SavedTravelerSlot}

            {/* Gender Selection */}
            <div className="space-y-3">
                <Label>
                    {t("gender")} <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    {["Male", "Female"].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => handleGenderChange(g)}
                            className={cn(
                                "p-2 rounded-lg border-2 transition-all cursor-pointer mt-2",
                                currentGender === g
                                    ? "border-accent-500 bg-accent-500 text-white shadow-md"
                                    : "border-gray-200 dark:border-gray-700 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/30",
                                showValidation &&
                                    !currentGender &&
                                    "border-red-500"
                            )}
                            disabled={false}
                        >
                            {t(g.toLowerCase())}
                        </button>
                    ))}
                </div>
                {/* {showValidation && !currentGender && (
                    <p className="text-sm text-red-500">
                        {t("gender_required") || "Please select gender"}
                    </p>
                )} */}
            </div>

            {/* First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        {t("first_name")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={traveler.firstName || ""}
                        onChange={(e) => {
                            let v = e.target.value
                                .replace(/[^A-Za-z ]/g, "")
                                .toUpperCase();
                            if (v.length > 30) v = v.slice(0, 30);
                            onFieldChange("firstName", v);
                        }}
                        className={cn(
                            "h-12 mt-2",
                            showValidation &&
                                !traveler.firstName &&
                                "border-red-500"
                        )}
                        placeholder={t("first_name_placeholder")}
                    />
                    <p className="text-xs text-muted-foreground">
                        {t("name_text_helper")}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>
                        {t("last_name")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={traveler.lastName || ""}
                        onChange={(e) => {
                            let v = e.target.value
                                .replace(/[^A-Za-z ]/g, "")
                                .toUpperCase();
                            if (v.length > 30) v = v.slice(0, 30);
                            onFieldChange("lastName", v);
                        }}
                        className={cn(
                            "h-12 mt-2",
                            showValidation &&
                                !traveler.lastName &&
                                "border-red-500"
                        )}
                        placeholder={t("last_name_placeholder")}
                    />
                    <p className="text-xs text-muted-foreground">
                        {t("name_text_helper")}
                    </p>
                </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
                <DateDropdownFields
                    label={t("date_of_birth")}
                    value={traveler.dateOfBirth || null}
                    onChange={handleDobChange}
                    minDate={minDob}
                    maxDate={maxDob}
                    required
                    error={showValidation && !traveler.dateOfBirth}
                />
                {ageError && (
                    <p className="text-sm text-red-500 font-medium">
                        {ageError}
                    </p>
                )}
            </div>

            {/* Passport Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        {t("passport_number")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={traveler.passportNumber || ""}
                        onChange={(e) => {
                            const v = e.target.value
                                .replace(/[^A-Za-z0-9]/g, "")
                                .toUpperCase();
                            onFieldChange("passportNumber", v);
                        }}
                        className={cn(
                            "h-12 mt-2",
                            showValidation &&
                                !traveler.passportNumber &&
                                "border-red-500"
                        )}
                        placeholder="A12345678"
                    />
                </div>

                <div className="space-y-2">
                    <Label>
                        {t("nationality")}{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <div
                        className={cn(
                            "mt-2",
                            showValidation &&
                                !traveler.nationality &&
                                "ring-1 ring-red-500 rounded-lg"
                        )}
                    >
                        <NationalitySelect
                            value={traveler.nationality || ""}
                            onValueChange={(value) =>
                                onFieldChange("nationality", value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Passport Expiry */}
            <DateDropdownFields
                label={t("passport_expiry_date")}
                value={traveler.passportExpiry || null}
                onChange={(date) =>
                    onFieldChange("passportExpiry", date || null)
                }
                minDate={new Date()}
                required
                error={showValidation && !traveler.passportExpiry}
            />
        </div>
    );
}

export { calcAge, deriveTitle, genderFromTitle };
