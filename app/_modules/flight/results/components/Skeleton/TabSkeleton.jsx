export default function TabSkeleton() {
    return (
        <div className="animate-pulse flex items-center justify-around gap-2 mb-4 md:hidden shadow p-2 rounded-xl ">
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
    );
}
