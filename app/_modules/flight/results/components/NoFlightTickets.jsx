"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

export default function NoFlightTickets() {
    const t = useTranslations("Flight");
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchObjectParam = searchParams.get("searchObject");
    const citiesParam = searchParams.get("cities");

    if (!searchObjectParam || !citiesParam) return null;

    const {
        depart_date,
        return_date,
        ADT,
        CHD,
        INF,
        class: tripClass,
    } = JSON.parse(searchObjectParam) || {};

    const { departure, destination } = JSON.parse(citiesParam) || {};

    const totalPassengers = (ADT || 0) + (CHD || 0) + (INF || 0);

    return (
        <Card className="shadow-none border-0 bg-transparent capitalize">
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

                    <h1 className="text-xl mb-2 mt-7 text-gray-950 font-semibold capitalize">
                        {t("operations.no_tickets_title")}
                    </h1>

                    <p className="text-md text-muted-foreground mb-2 capitalize">
                        {t("operations.no_tickets_sub_title")}
                    </p>

                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 justify-center capitalize">
                        <Calendar className="size-5" />
                        {t("operations.no_tickets_one_way", {
                            departure: departure.city,
                            destination: destination.city,
                        })}
                    </p>

                    {return_date && (
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2 justify-center">
                            <Calendar className="size-5" />
                            {t("operations.no_tickets_round_trip", {
                                destination: destination.city,
                                departure: departure.city,
                            })}
                        </p>
                    )}

                    <p className="text-sm text-muted-foreground mb-20 flex items-center gap-2 justify-center capitalize">
                        <UserIcon className="size-5" />
                        {totalPassengers}{" "}
                        {totalPassengers > 1 && t("passengers.passengers")}{" "}
                        {t(
                            `ticket_class.${String(
                                tripClass
                            ).toLocaleLowerCase()}`
                        )}
                    </p>

                    <Button
                        className="btn-primary sm:w-80 capitalize"
                        onClick={() => router.refresh()}
                    >
                        {t("operations.refrech")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
