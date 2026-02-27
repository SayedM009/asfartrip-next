import PersonalInfoForm from "@/app/_modules/profile/features/personal-info/components/PersonalInfoForm";
import { getTranslations } from "next-intl/server";

async function Page() {
    const t = await getTranslations("Profile");
    return <>
        <h1 className="text-2xl font-bold mb-4">{t("personal_info")}</h1>
        <PersonalInfoForm />
    </>;
}

export default Page;