// app/[locale]/offers/page.jsx

import { getOffers } from "@/app/_modules/offers/services/getOffers";
import OffersGrid from "@/app/_modules/offers/components/organisms/OffersGrid";

export default async function OffersPage() {
    const offers = await getOffers();

    return <OffersGrid offers={offers} />;
}
