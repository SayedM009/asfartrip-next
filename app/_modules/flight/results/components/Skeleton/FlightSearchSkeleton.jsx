import FilterSkeleton from "./FilterSkeleton";
import TabSkeleton from "./TabSkeleton";
import TicketSkeleton from "./TicketSkeleton";

export default function FlightSearchSkeleton() {
    return (
        <div className="mt-5">
            <div className="grid grid-cols-12 gap-4">
                <div className="hidden md:block md:col-span-3">
                    <FilterSkeleton />
                </div>
                <div className="col-span-12 md:col-span-9 space-y-4">
                    <TabSkeleton />
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <TicketSkeleton key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}
