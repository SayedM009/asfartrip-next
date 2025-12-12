import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function PayInInstallments() {
    const i = useTranslations("Installments");
    return (
        <div className="flex items-center pl-1.5 gap-1">
            <div className="w-fit  rounded-full border-accent-500 ">
                <CheckCircleIcon className="size-5   text-green-500 " />
            </div>
            <span className="text-xs  font-medium text-green-600 dark:text-green-500  ">
                {i("installments_available")}
            </span>
        </div>
    );
}
