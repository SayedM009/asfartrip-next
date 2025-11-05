import React, { useState } from "react";
import { Plane, Building2, Car, Tag, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ServiceNavigation() {
    const [selectedService, setSelectedService] = useState("flights");

    const services = [
        {
            id: "flights",
            name: "Flights",
            icon: Plane,
            description: "Book flights ",
        },
        {
            id: "hotels",
            name: "Hotels",
            icon: Building2,
            description: "Find perfect stays",
        },
        {
            id: "cars",
            name: "Car Rentals",
            icon: Car,
            description: "Rent vehicles easily",
        },
        {
            id: "deals",
            name: "Deals",
            icon: Tag,
            description: "Special offers",
        },
    ];

    return (
        <div className="hidden md:block max-w-4xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
                {services.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedService === service.id;

                    return (
                        <Card
                            key={service.id}
                            className={cn(
                                "flex-1 transition-all duration-200 cursor-pointer hover:shadow-md border-2",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-lg"
                                    : "border-border hover:border-primary/30"
                            )}
                            onClick={() => setSelectedService(service.id)}
                        >
                            <div className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isSelected
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={cn(
                                                "font-medium transition-colors",
                                                isSelected
                                                    ? "text-primary"
                                                    : "text-foreground"
                                            )}
                                        >
                                            {service.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground hidden sm:block">
                                            {service.description}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
