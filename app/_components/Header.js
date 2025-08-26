import LanguageSwitcher from "./LanguageSwitcher";
import Login from "./Login";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

function Header() {
  return (
    <header className="flex items-center justify-between container-custom ">
      <Logo />
      <div className="flex items-center gap-0.5">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <Login />
      </div>
    </header>
  );
}

export default Header;
