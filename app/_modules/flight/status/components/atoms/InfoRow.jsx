/**
 * Info Row - Displays label-value pair
 * @param {Object} props
 * @param {string|React.ReactNode} props.label - Label text or component
 * @param {string} props.value - Value text
 * @param {boolean} props.highlighted - Whether to highlight the value
 */
export default function InfoRow({ label, value, highlighted = false }) {
    return (
        <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className={`font-semibold ${
                highlighted 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-900 dark:text-white'
            }`}>
                {value}
            </span>
        </div>
    );
}
