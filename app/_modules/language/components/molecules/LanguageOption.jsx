import LanguageFlag from "../atoms/LanguageFlag";
import LanguageName from "../atoms/LanguageName";

export default function LanguageOption({ flag, name }) {
    return (
        <div className="flex items-center space-x-2">
            <LanguageFlag flag={flag} alt={name} />
            <LanguageName>{name}</LanguageName>
        </div>
    );
}
