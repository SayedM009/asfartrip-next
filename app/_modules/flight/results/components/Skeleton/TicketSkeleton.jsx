export default function TicketSkeleton() {
    return (
        <div className="animate-pulse rounded-xl p-4 flex flex-col mb-4 shadow-lg dark:shadow-gray-700">
            {/* Departure */}
            <div className="flex justify-between mb-4">
                <div className="flex flex-col items-start">
                    <div className="h-5 w-16 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-10 bg-gray-200 rounded mb-1"></div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="h-5 w-16 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                </div>
            </div>

            {/* Airline & Price */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col">
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="h-3 w-14 bg-gray-200 rounded mb-1"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded hidden md:block"></div>
                </div>
            </div>
        </div>
    );
}
