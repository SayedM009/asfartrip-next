// app/_modules/offers/services/getOffers.js
import { offers } from "../data/offersData";

export async function getOffers() {
    // هنا ممكن لاحقاً تستبدلها بـ fetch من API حقيقي
    return offers;
}
