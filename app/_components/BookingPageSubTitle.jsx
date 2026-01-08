export default function BookingPageSubTitle({ t, tKey, children }) {
    return (
        <div className="capitalize flex items-center gap-2 text-xs  dark:text-gray-200 truncate">
            <span>{t(tKey)}</span>

            {children && (
                <>
                    <span>|</span>
                    {children}
                </>
            )}
        </div>
    );
}
