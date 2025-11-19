import { offers } from "../data/offersData";

export async function getOfferBySlug(slug) {
    return offers.find((offer) => offer.slug === slug);
}
