import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

function Login() {
  const t = useTranslations();

  return (
    <button
      className="icons-hover-600  gap-2 border-1 border-accent-50 hidden md:flex"
      aria-label={t("Login.ariaLabel")}
      title={t("Login.title")}
    >
      {/* <UserCircleIcon /> */}
      <p className="font-medium ">{t("Login.title")}</p>
    </button>
  );
}

export default Login;
