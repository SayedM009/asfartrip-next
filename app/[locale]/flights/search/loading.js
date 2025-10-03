"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function Loading() {
    const params = useSearchParams();
    const t = useTranslations("Flight");
    const { destination: destinationObj } = JSON.parse(params.get("cities"));
    const destinationCity = destinationObj.city;
    const tripType =
        JSON.parse(params.get("searchObject")).type === "O"
            ? "one_way"
            : "round_trip";
    return (
        <section className="w-full h-lvh flex items-center justify-center flex-col">
            <div>
                <Image
                    src="/icons/tickets.gif"
                    alt="Flight tickets "
                    width={200}
                    height={200}
                />
            </div>
            <h1 className="text-2xl font-semibold text-center capitalize">
                {t(`operations.search_loading`, {
                    tripType: t(tripType),
                    destinationCity,
                })}
            </h1>
        </section>
    );
}

export default Loading;
