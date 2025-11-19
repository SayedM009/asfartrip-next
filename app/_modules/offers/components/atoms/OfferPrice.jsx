import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useTranslations } from "next-intl";

export default function OfferPrice({ amount }) {
    const o = useTranslations("OffersPage");
    const { formatPrice } = useCurrency();
    if (!amount) return null;

    return (
        <div className="text-lg font-semibold">
            {o("starting_from")}:{" "}
            <span className="text-primary font-bold">
                {formatPrice(amount)}
            </span>
        </div>
    );
}
