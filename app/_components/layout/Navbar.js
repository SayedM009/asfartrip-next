import { LanguageSwitcher } from "../../_modules/language";
import { ThemeSwitcher } from "@/app/_modules/theme";
import CurrencySwitcher from "@/app/_modules/currency/components/organisms/CurrencySwitcher";
import Logo from "../ui/Logo";
import { LoginButton } from "@/app/_modules/auth";

async function Navbar() {
    return (
        <nav className="flex items-center justify-between sm:border-b-1 pt-2 md:pt-0 pb-3">
            <Logo />
            <div className="flex items-center gap-1 ">
                <CurrencySwitcher hiddenOnMobile={true} isLabel={false} />
                <LanguageSwitcher hiddenOnMobile={true} />
                <ThemeSwitcher hiddenOnMobile={true} />
                <LoginButton />
            </div>
        </nav>
    );
}

export default Navbar;

export function WegoMobileNavbar() {
    return (
        <nav className="flex items-center justify-between sm:border-b-1 pt-2 md:pt-0 pb-3 md:hidden">
            <Logo logoSRC="/lightLogo.webp" />
            <div className="flex items-center gap-1 ">
                <LoginButton />
            </div>
        </nav>
    );
}