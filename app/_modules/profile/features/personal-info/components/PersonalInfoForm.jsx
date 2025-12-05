import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { TravelerBasicFieldsSkeleton } from "@/app/_components/TravelerBasicFieldsSkeleton";
import { fetchUserProfile, updateProfileClient } from "@/app/_libs/profile";
import useAuthStore from "@/app/_modules/auth/store/authStore";
import TravelerBasicFields from "@/app/_components/TravelerBasicFields";

function PersonalInfo({ close }) {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [showValidation, setShowValidation] = useState(false);

    const { user: savedUser, updateSessionUser, updateUser } = useAuthStore();
    const p = useTranslations("Profile");

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            try {
                const { data: user } = await fetchUserProfile({
                    user_id: savedUser.id,
                    user_type: savedUser.usertype,
                });
                const travelerFormat = {
                    ...user,
                    title: user.title || "",
                    firstName: user.firstname || "",
                    lastName: user.lastname || "",
                    dateOfBirth: user.dob || "",
                    nationality: user.country_code || "",
                    passportNumber: user.middlename || "",
                    passportExpiry: "",
                };

                setUserInfo(travelerFormat);
            } catch (err) {
                toast.error(p("pull_failed"));
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [savedUser.id, savedUser.usertype]);

    const handleChange = (field, value) => {
        setUserInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setSuccess("");
        setShowValidation(true);

        if (
            !userInfo.title ||
            !userInfo.firstName ||
            !userInfo.lastName ||
            !userInfo.dateOfBirth ||
            !userInfo.passportNumber ||
            !userInfo.nationality ||
            !userInfo.passportExpiry
        ) {
            toast.error(p("fields_required"));
            return;
        }

        setLoading(true);

        try {
            await updateProfileClient({
                ...userInfo,
                title: userInfo.title,
                firstname: userInfo.firstName,
                lastname: userInfo.lastName,
                dob: format(userInfo.dateOfBirth, "yyyy-MM-dd"),
                country_code: userInfo.nationality,
                middlename: userInfo.passportNumber,
                user_id: savedUser.id,
            });

            const { data: updatedUser } = await fetchUserProfile({
                user_id: savedUser.id,
                user_type: savedUser.usertype,
            });

            updateSessionUser(updatedUser);
            updateUser({
                name: `${updatedUser.firstname} ${updatedUser.lastname}`,
            });

            toast.success(p("update_success"));
            setShowValidation(false);
            close();
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(p("update_failed"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <TravelerBasicFieldsSkeleton />;

    return (
        <div>
            <TravelerBasicFields
                traveler={userInfo}
                onFieldChange={handleChange}
                showValidation={showValidation}
                isLoggedIn={true}
            />
            {success && <p className="text-green-600 mt-3">{success}</p>}
            <div className="pt-8">
                <Button
                    className="bg-accent-500 hover:bg-[#cf5f1a] text-white text-sm py-5 rounded-full shadow-md w-full"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {p("save_information")}
                </Button>
            </div>
        </div>
    );
}

export default PersonalInfo;
