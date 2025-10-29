import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function PayInInstallments() {
    return (
        <div className="flex items-center ">
            <div className="w-fit  rounded-full border-accent-500 ">
                <CheckCircleIcon className="size-5   text-green-500 " />
            </div>
            <span className="text-xs  font-medium text-green-600 dark:text-green-500">
                التقسيط متاح
            </span>
        </div>
    );
}
