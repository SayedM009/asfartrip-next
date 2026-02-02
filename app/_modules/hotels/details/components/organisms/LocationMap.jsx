"use client";

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocationMap({
    latitude,
    longitude,
    hotelName,
    address,
}) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    return (
        <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden h-[300px] bg-muted">
                {lat && lng ? (
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        title={`${hotelName} Location`}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                            Map not available
                        </p>
                    </div>
                )}
            </div>

            {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{address}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <a href={directionsUrl} target="_blank">
                        <Navigation className="h-4 w-4 me-2" />
                        Get Directions
                    </a>
                </Button>
            </div> */}
        </div>
    );
}
