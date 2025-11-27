import { useTranslations } from "next-intl";
import InfoRow from "../atoms/InfoRow";
import { Mail, Phone, User, User2 } from "lucide-react";

/**
 * Contact Info - Shows contact details
 * @param {Object} props
 * @param {Object} props.contact - Contact data
 */
export default function ContactInfo({ contact }) {
    const t = useTranslations("FlightStatus");
    if (!contact) return null;
    
    const { name, email, phone } = contact;
    
    return (
        <div className=" py-4 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {t('contact_details')}
            </h3>
            
            <div className="flex flex-col gap-2">
                {name && <InfoRow label={<span className="flex items-center gap-2"> <User2 className="w-4 h-4 text-gray-900 dark:text-white" /> {t('name')}</span>} value={name} />}
                {email && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-900 dark:text-white" />
                        <span className="text-gray-500 dark:text-gray-400">{t('email')}:</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">{email}</span>
                    </div>
                )}
                {phone && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-900 dark:text-white" />
                        <span className="text-gray-500 dark:text-gray-400">{t('phone')}:</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">{phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
