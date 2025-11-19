import CurrencyFlag from "../atoms/CurrencyFlag";
import CurrencyLabel from "../atoms/CurrencyLabel";

export default function CurrencyOption({ label, flag }) {
    return (
        <div className="flex items-center space-x-2 rtl:space-x-reverse gap-2">
            <CurrencyFlag src={flag} alt={label} />
            <CurrencyLabel label={label} />
        </div>
    );
}
