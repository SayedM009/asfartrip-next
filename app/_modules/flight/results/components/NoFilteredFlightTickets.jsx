// app/_modules/flights/results/components/NoFilteredFlightTickets.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function NoFilteredFlightTickets({ resetFilters }) {
    const t = useTranslations("Flight");

    return (
        <Card className="shadow-none border-0 bg-transparent">
            <CardContent className="flex items-center justify-center py-12 flex-col">
                <div className="text-center">
                    <div className="relative flex justify-center">
                        <Image
                            src="/not-found/no-flights.webp"
                            alt="no-flights"
                            className="object-cover"
                            width={500}
                            height={500}
                        />
                    </div>

                    <h1 className="text-xl mb-2 mt-7 text-gray-950 font-semibold">
                        {t("operations.no_filtered_tickets_title")}
                    </h1>

                    <p className="text-sm text-muted-foreground mb-20">
                        {t("operations.no_filtered_tickets_sub_title")}
                    </p>

                    <Button
                        className="btn-primary capitalize"
                        onClick={resetFilters}
                    >
                        {t("operations.reset_filters")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
