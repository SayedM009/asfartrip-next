import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

function Login() {
  const t = useTranslations();

  return (
    <button
      className="icons-hover-600 flex gap-2 "
      aria-label={t("Login.ariaLabel")}
      title={t("Login.title")}
    >
      <UserCircleIcon />
      <p className="font-medium hidden lg:block">{t("Login.title")}</p>
    </button>
  );
}

export default Login;
