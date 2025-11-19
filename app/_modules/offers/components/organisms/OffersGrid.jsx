// app/_modules/offers/components/organisms/OffersGrid.jsx

import OffersHeader from "../molecules/OffersHeader";
import OfferCard from "./OfferCard";

export default function OffersGrid({ offers }) {
    if (!offers?.length) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 space-y-6 pb-16">
            <div className="col-span-full">
                <OffersHeader />
            </div>

            {offers.map((offer, index) => (
                <OfferCard key={index} offer={offer} />
            ))}
        </div>
    );
}
