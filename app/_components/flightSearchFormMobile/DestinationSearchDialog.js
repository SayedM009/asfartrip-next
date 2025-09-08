import { searchAirports } from "@/app/_libs/api-services";
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
import { LucideSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const popularCities = [
  "cairo",
  "manila",
  "sharjah",
  "london",
  "dubai",
  "jeddah",
];

const destinationsByRegion = {
  asia: ["dubai", "abu_dhabi", "sharjah", "kochi", "kozhikode", "manila"],
  europe: ["london", "madrid", "milan", "tbilisi", "paris", "amsterdam"],
  north_america: [
    "new_york",
    "los_angeles",
    "miami",
    "chicago",
    "san_francisco",
    "toronto",
  ],
  south_america: [
    "sao_paulo",
    "rio_de_janeiro",
    "bogota",
    "buenos_ires",
    "santiago",
    "lima",
  ],
  africa: [
    "cairo",
    "south_africa",
    "alexandria",
    "casablanca",
    "tunis",
    "algiers",
  ],
};

function DestinationSearchDialog({
  destination,
  onSelect,
  locale,
  dir = "start",
}) {
  const [results, setResults] = useState([]);
  const searchDirection = locale == "en" ? "left-3" : "right-3";
  const t = useTranslations("Flight");
  async function handleSearch(value) {
    if (!value) return setResults([]);
    if (value.length <= 2) return setResults([]);
    const data = await searchAirports(value);
    setResults(data);
  }
  return (
    <Dialog
      onOpenChange={() => {
        setResults([]);
      }}
    >
      <DialogTrigger
        className={`flex-1 flex flex-wrap justify-${dir} font-semibold text-primary-900 `}
      >
        {destination.city || "City"}
        <span
          className={`w-full text-gray-500 font-normal text-sm flex justify-${dir}`}
        >
          {destination.code || "City"}
        </span>
      </DialogTrigger>
      <DialogContent className=" bg-background h-full w-full max-w-none rounded-none border-0 p-3 overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription className="mt-8">
            <div className="relative w-full max-w-sm">
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
            {!results.length ? (
              <PreparedResultsList onSelect={onSelect} />
            ) : (
              <APIResultsList results={results} onSelect={onSelect} />
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
            onClick={() =>
              onSelect({ city: result.city, code: result.label_code })
            }
            className="bg-white text-primary-900 h-14 flex flex-col gap-0 items-start w-full "
          >
            <div>
              <span className="font-bold text-md text-accent-600">
                {result.label_code}
              </span>{" "}
              <span>{result.city}</span>
            </div>
            <span className="text-xs">
              {String(result.country).split("-").slice(1)}{" "}
            </span>
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
          {popularCities.map((city) => (
            <DialogClose asChild key={city} onClick={() => onSelect(city)}>
              <Button className="w-full  rounded bg-gray-200 text-gray-950 text-[.7rem] capitalize">
                {t(`cities.${city}`)}
              </Button>
            </DialogClose>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start mt-4">
        {Object.entries(destinationsByRegion).map(([region, cities]) => (
          <div key={region} className="w-full">
            <div className="mt-3 mb-3 font-bold text-start">
              {t(`${region}`)}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {cities.map((city) => (
                <DialogClose asChild key={city} onClick={() => onSelect(city)}>
                  <Button className=" rounded bg-gray-200 text-gray-950 text-[.7rem] capitalize">
                    {t(`cities.${city}`)}
                  </Button>
                </DialogClose>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DestinationSearchDialog;
