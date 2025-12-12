export function TravelerBasicFieldsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Gender Selection */}
            <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>

            {/* First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>

            {/* Date of Birth */}
            <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>

            {/* Passport Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Passport Expiry */}
            <div className="space-y-3">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
