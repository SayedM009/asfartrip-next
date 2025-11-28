import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LucideSearch, PlaneIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchAirports } from "../../services/searchAirports";
import {
    popularCities,
    destinationsByRegion,
} from "../../constants/popularDestinations";
import SpinnerMini from "@/app/_components/ui/SpinnerMini";

// Popular destinations data imported from shared constants file
// See: constants/popularDestinations.js

function DestinationSearchDialog({
    destination,
    onSelect,
    locale,
    dir = "start",
    sessionKey,
}) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchDirection = locale == "en" ? "left-3" : "right-3";
    const t = useTranslations("Flight");

    /**
     * Debounced airport search - reduces API calls by waiting 350ms after user stops typing
     * Applies validation to filter out incomplete/invalid airports
     */
    const debouncedSearch = useDebouncedCallback(async (value) => {
        if (!value || value.length <= 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        try {
            const data = await searchAirports(value);

            // Filter invalid / incomplete results (same as desktop)
            const validResults = data.filter(
                (d) =>
                    d.label_code?.length === 3 &&
                    d.city &&
                    d.country &&
                    !d.city.toLowerCase().includes("test")
            );

            setResults(validResults);
        } catch (error) {
            console.error("Error searching airports:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, 350);

    function handleSearch(value) {
        if (!value || value.length <= 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setResults([]); // clear old results immediately
        debouncedSearch(value);
    }

    function handleSelectedDestinationFromAPI(value) {
        onSelect({
            city: value.city,
            label_code: value.label_code,
            country: value.country,
        });
    }

    function handleSelectedDestinationFromRegion(value) {
        onSelect({
            city: value.city,
            label_code: value.label_code,
            country: value.country,
        });
    }
    return (
        <Dialog
            onOpenChange={() => {
                setResults([]);
            }}
        >
            <DialogTrigger
                className={`flex-1 flex flex-wrap justify-${dir} font-semibold capitalize max-ch-20`}
            >
                {destination?.city ?? t("city")}
                <span
                    className={`w-full dark:text-gray-50 font-normal text-sm flex justify-${dir}`}
                >
                    {destination?.label_code ?? t("airport")}
                </span>
            </DialogTrigger>
            <DialogContent className=" bg-background h-full w-full max-w-none rounded-none border-0 p-3 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription className="mt-8">
                        <div className="relative w-full">
                            <Input
                                type="search"
                                placeholder={t("search_by_city_airport")}
                                className="rounded focus:outline-0 placeholder:text-sm placeholder:text-gray-400 text-sm  ps-10 shadow-none focus:ring-0 focus:border-gray-300"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <LucideSearch
                                className={`absolute ${searchDirection} top-1/2 transform -translate-y-1/2  text-primary-100`}
                                size={20}
                            />
                        </div>
                        {isLoading ? (
                            <div className="p-4 text-center flex items-center justify-center h-56">
                                <SpinnerMini />
                            </div>
                        ) : !results.length ? (
                            <PreparedResultsList
                                onSelect={handleSelectedDestinationFromRegion}
                            />
                        ) : (
                            <APIResultsList
                                results={results}
                                onSelect={handleSelectedDestinationFromAPI}
                            />
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function APIResultsList({ results, onSelect }) {
    return (
        <div className="mt-5">
            {results.map((result) => (
                <DialogClose
                    key={result.label_code + result.country}
                    className="flex mb-3 w-full "
                >
                    <Button
                        onClick={() => onSelect(result)}
                        className="bg-white text-primary-900 h-14 w-full flex items-center justify-start"
                    >
                        <PlaneIcon />
                        <div className="flex flex-col items-start">
                            <div>
                                <span className="font-bold text-md text-accent-600">
                                    {result.label_code}
                                </span>{" "}
                                <span>{result.city}</span>
                            </div>
                            <span className="text-xs">
                                {String(result.country).split("-").slice(1)}{" "}
                            </span>
                        </div>
                    </Button>
                </DialogClose>
            ))}
        </div>
    );
}

function PreparedResultsList({ onSelect }) {
    const t = useTranslations("Flight");
    return (
        <section className="mt-5">
            <div className="flex flex-col items-start mb-0">
                <span className="mb-3 font-bold">{t("popular_cities")}</span>
                <div className="grid grid-cols-3 gap-3 w-full">
                    {popularCities.map(({ city, label_code, country }) => (
                        <DialogClose
                            asChild
                            key={city}
                            onClick={() =>
                                onSelect({ city, label_code, country })
                            }
                        >
                            <Button className="w-full  rounded bg-gray-200 text-gray-950 text-[.7rem] capitalize">
                                {t(`cities.${city}`)}
                            </Button>
                        </DialogClose>
                    ))}
                </div>
            </div>
            {Object.entries(destinationsByRegion).map(([region, cities]) => (
                <div key={region} className="w-full">
                    <div className="mt-3 mb-3 font-bold text-start">
                        {t(`${region}`)}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {cities.map(({ city, label_code, country }) => (
                            <DialogClose
                                asChild
                                key={label_code}
                                onClick={() =>
                                    onSelect({ city, label_code, country })
                                }
                            >
                                <Button className="rounded bg-gray-200 text-gray-950 text-[.7rem] capitalize">
                                    {t(`cities.${city}`)}
                                </Button>
                            </DialogClose>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default DestinationSearchDialog;
