import { Button } from "@/components/ui/button";
import BackwardButton from "../../layout/BackwardButton";

export default function TicketExpired() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <h2 className="text-xl mb-2">Ticket expired or not found</h2>
                <p className="text-muted-foreground">
                    Please search for a new flight
                </p>
                <BackwardButton>
                    <Button>Back</Button>
                </BackwardButton>
            </div>
        </div>
    );
}
