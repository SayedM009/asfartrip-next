"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function Loading() {
    const params = useSearchParams();
    const { destination: destinationObj } = JSON.parse(params.get("cities"));
    const destinationCity = destinationObj.city;
    const tripType =
        JSON.parse(params.get("searchObject")).type === "O"
            ? "oneway"
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
            <h1 className="text-2xl font-semibold text-center">
                Searching for {tripType} flight to {destinationCity} ...
            </h1>
        </section>
    );
}

export default Loading;
