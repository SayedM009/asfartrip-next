import LanguageSwitcher from "./LanguageSwitcher";
import Login from "./Login";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

function Header() {
  return (
    <nav className="flex items-center justify-between container-custom">
      <Logo />
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <Login />
      </div>
    </nav>
  );
}

export default Header;
