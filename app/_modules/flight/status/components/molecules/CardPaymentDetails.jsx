import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import InfoRow from "../atoms/InfoRow";

/**
 * Card Payment Details - Shows card payment information
 * @param {Object} props
 * @param {Object} props.payment - Payment data with card details
 */
export default function CardPaymentDetails({ payment }) {
    const t = useTranslations("FlightStatus");
    
    if (!payment) return null;
    
    const {
        card_type,
        card_last4,
        method,
        status,
        payment_status,
        date,
        transaction_date
    } = payment;
    
    // Format card display
    const cardDisplay = card_type && card_last4 
        ? `${card_type} •••• ${card_last4}`
        : method || 'N/A';
    
    
    // Translate status (use payment_status or status)
    const statusValue = payment_status || status || 'N/A';
    const translatedStatus = statusValue === 'N/A' ? 'N/A' :
        (statusValue.toLowerCase() === 'completed' || statusValue.toLowerCase() === 'paid' ? t('completed') :
         statusValue.toLowerCase() === 'pending' ? t('pending') :
         statusValue.toLowerCase() === 'failed' ? t('failed') :
         statusValue);
    
    // Use transaction_date first, then fallback to date
    const displayDate = transaction_date || date;
    
    return (
        <div className="py-4 px-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {t('payment_info')}
            </h3>
            
            <div className="flex flex-col gap-3">
                {card_type && (
                    <InfoRow 
                        label={t('card_type')} 
                        value={card_type} 
                    />
                )}
                
                {cardDisplay && (
                    <InfoRow 
                        label={t('payment_method')} 
                        value={cardDisplay} 
                    />
                )}
                
                <InfoRow 
                    label={t('status')} 
                    value={translatedStatus} 
                    highlighted 
                />
                
                {displayDate && (
                    <InfoRow 
                        label={t('payment_date')} 
                        value={displayDate}
                    />
                )}
            </div>
        </div>
    );
}
