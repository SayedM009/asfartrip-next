export default function TopMobileSection({ children }) {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
