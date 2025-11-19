import { Link } from "@/i18n/navigation";
import SliderImage from "../atoms/SliderImage";

export default function SliderCard({ offer, locale }) {
    console.log(offer);
    return (
        <Link
            href={`/offers/${offer.slug}`}
            className="flex-shrink-0 w-[80vw] sm:w-[350px] lg:w-[480px] aspect-[16/7] relative rounded-xl overflow-hidden"
            style={{ scrollSnapAlign: "start" }}
        >
            <SliderImage src={offer.image[locale]} alt={offer.title[locale]} />
        </Link>
    );
}
