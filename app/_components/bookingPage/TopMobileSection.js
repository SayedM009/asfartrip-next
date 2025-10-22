import { Ticket } from "lucide-react";
import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function TopMobileSection({ ticket, children }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const f = useTranslations("Flight");
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    {children}
                    <div className="text-right shrink-0 rtl:text-left flex items-end">
                        <div className="text-lg text-primary-600 dark:text-primary-400">
                            <FlightDetailsDialog
                                ticket={ticket}
                                isOpen={showDetailsDialog}
                                onClose={() =>
                                    setShowDetailsDialog(!showDetailsDialog)
                                }
                                withContinue={false}
                                trigger={{
                                    title: f("booking.details"),
                                    icon: <Ticket className="w-4 h-4" />,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
