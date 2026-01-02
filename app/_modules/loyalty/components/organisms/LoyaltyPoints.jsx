import { useTranslations } from "next-intl";
import useLoyaltyStore from "../../store/loyaltyStore";

export default function LoyaltyPoints({ price }) {
    const l = useTranslations("Loyalty");
    const { config, calculatePoints, isLoading } = useLoyaltyStore();

    // Gate on presence of config - only populated after auth sync via LoyaltyInitializer
    // null config means either session not confirmed OR unauthenticated
    if (!config) return null;

    const points = calculatePoints(price);

    if (isLoading || !config) {
        return (
            <div className="flex items-center gap-1 py-1 px-1 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse w-[90px] h-[20px]">
                <div className="bg-gray-300 dark:bg-gray-600 w-4 h-4 rounded-full" />
                <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 py-0.5 pl-2 pr-1 rtl:pl-1 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl rounded-bl-2xl">
            <div className="bg-[#1fa86b] w-fit p-0.5 rounded-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-3 text-white"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <span
                className="text-[8px] sm:text-xs"
                dangerouslySetInnerHTML={{
                    __html: l.rich("inline_points", {
                        bold: (chunks) =>
                            `<span class='font-bold text-xs'>${chunks}</span>`,
                        points: points,
                    }),
                }}
            />
        </div>
    );
}
