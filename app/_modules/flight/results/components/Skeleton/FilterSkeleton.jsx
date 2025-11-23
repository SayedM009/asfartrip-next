export default function FilterSkeleton() {
    return (
        <div className="animate-pulse p-4 rounded-xl shadow-lg dark:shadow-gray-700 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Stops Section */}
            <div className="mb-6">
                <div className="h-5 w-20 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Fare Type Section */}
            <div className="mb-6">
                <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Airlines Section */}
            <div className="mb-6">
                <div className="h-5 w-20 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <div className="h-5 w-28 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* Duration Range */}
            <div className="mb-6">
                <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* Stopover Range */}
            <div>
                <div className="h-5 w-36 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
