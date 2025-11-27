import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import InfoRow from "../atoms/InfoRow";

/**
 * Payment Details - Shows payment gateway information
 * @param {Object} props
 * @param {Object} props.payment - Payment data
 */
export default function PaymentDetails({ payment }) {
    const t = useTranslations("FlightStatus");
    
    if (!payment) return null;
    
    const {
        card_type,
        card_last4,
        payment_status,
        transaction_date
    } = payment;
    
    // Format card number display with last 4 digits
    const cardNumber = card_last4 ? `•••• ${card_last4}` : 'N/A';
    
    return (
        <div className="py-4 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {t('payment_info')}
            </h3>
            
            <div className="flex flex-col gap-3">
                {/* Show card type from API (Visa Credit, Mastercard, etc.) */}
                {card_type && (
                    <InfoRow label={t('method')} value={card_type} />
                )}
                
                {/* Show card last 4 digits */}
                {card_last4 && (
                    <InfoRow label={t('card_number')} value={cardNumber} />
                )}
                
                {/* Show raw status from API (Paid, Completed, etc.) */}
                {payment_status && (
                    <InfoRow label={t('status')} value={payment_status} highlighted />
                )}
                
                {transaction_date && (
                    <InfoRow 
                        label={t('payment_date')} 
                        value={transaction_date}
                    />
                )}
            </div>
        </div>
    );
}
