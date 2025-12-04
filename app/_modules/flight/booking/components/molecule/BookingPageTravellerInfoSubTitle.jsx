import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

export default function BookingPageTravellerInfoSubTitle({ t, searchInfo }) {
    return (
        <div className="capitalize flex items-center gap-2 text-xs  dark:text-gray-200 truncate">
            <span>
                {t(`ticket_class.${String(searchInfo.class).toLowerCase()}`)}
            </span>

            <span>|</span>

            <div className="flex items-center gap-2">
                {searchInfo.origin}
                <ChevronBasedOnLanguage icon="arrow" size="3" />
                {searchInfo.destination}
            </div>
        </div>
    );
}
