import { useTranslations } from "next-intl";
import PriceTag from "../atoms/PriceTag";
import useBookingStore from "../../../booking/store/bookingStore";

/**
 * Pricing Breakdown - Shows detailed price breakdown
 * @param {Object} props
 * @param {Object} props.pricing - Pricing data
 * @param {number} props.paymentAmount - Actual payment amount from API
 */
export default function PricingBreakdown({ pricing, paymentAmount }) {
    const t = useTranslations("FlightStatus");
    const { baseFare, taxes, total, currency } = pricing;
    const {baggagePrice, mealPrice} = useBookingStore(state => state.addOns);
    const {premium:insurancePrice} = useBookingStore(state => state.selectedInsurance);

    
    // Use payment amount if available, otherwise use total from pricing
    const displayTotal = paymentAmount || total;
    
    return (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex-1 py-4  px-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 ">
                 {t('price_breakdown')}
            </h3>
            
            <div className="flex flex-col ">
                {/* Only show Base Fare if it's greater than 0 */}
                {baseFare > 0 && (
                    <PriceTag 
                        label={t('base_fare')} 
                        amount={baseFare} 
                        currency={currency} 
                    />
                )}
                
                {/* Only show Taxes & Fees if it's greater than 0 */}
                {taxes > 0 && (
                    <PriceTag 
                        label={t('taxes_fees')} 
                        amount={taxes} 
                        currency={currency} 
                    />
                )}
                
                {/* Always show Add-ons even if 0 */}
                <PriceTag 
                    label={t('baggage')} 
                    amount={baggagePrice} 
                    currency={currency} 
                />
                <PriceTag 
                    label={t('meals')} 
                    amount={mealPrice} 
                    currency={currency} 
                />

                <PriceTag 
                    label={t('insurance')} 
                    amount={insurancePrice} 
                    currency={currency} 
                />
                
                <PriceTag 
                    label={t('total_paid')} 
                    amount={displayTotal} 
                    currency={currency} 
                    highlighted 
                />
            </div>
        </div>
    );
}
