export default function SectionContainer({ title, children }) {
    return (
        <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2 px-1">
                {title}
            </h2>
            <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-[#e5e8ef] dark:border-neutral-800 divide-y divide-[#e5e8ef] dark:divide-neutral-800 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
