import LanguageSwitcher from "./LanguageSwitcher";
import LoginButton from "./loginButton/LoginButton";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

async function Header() {
    return (
        <nav className="flex items-center justify-between border-b-1 pb-1">
            <Logo />
            <div className="flex items-center gap-1 ">
                <LanguageSwitcher hiddenOnMobile={true} />
                <ThemeSwitcher hiddenOnMobile={true} />
                <LoginButton />
            </div>
        </nav>
    );
}

export default Header;
