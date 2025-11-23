export default function PriceBreakdown({
    t,
    BasePrice,
    Taxes,
    TotalPrice,
    formatPrice,
}) {
    return (
        <div className="space-y-6">
            <h4 className="font-semibold">{t("dialog.price_breakdown")}</h4>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>{t("dialog.base_price")}</span>
                    <span>{formatPrice(BasePrice)}</span>
                </div>

                <div className="flex justify-between">
                    <span>{t("dialog.taxes_fees")}</span>
                    <span>{formatPrice(Taxes)}</span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between font-semibold">
                    <span>{t("dialog.total_price")}</span>
                    <span className="text-accent-400">
                        {formatPrice(TotalPrice)}
                    </span>
                </div>
            </div>
        </div>
    );
}
