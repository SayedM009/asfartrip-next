import { getOfferBySlug } from "@/app/_modules/offers/services/getOfferBySlug";
import OfferDetailsCard from "@/app/_modules/offers/components/organisms/OfferDetailsCard";

export default async function OfferDetailsPage({ params }) {
    const { locale, slug } = params;

    const offer = await getOfferBySlug(slug);

    if (!offer) {
        return <div className="p-8">Offer not found</div>;
    }

    const isArabic = locale === "ar";
    const dir = isArabic ? "rtl" : "ltr";

    return <OfferDetailsCard offer={offer} locale={locale} />;
}
