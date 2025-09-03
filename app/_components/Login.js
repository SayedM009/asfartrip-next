import { useTranslations } from "next-intl";

function Login() {
  const t = useTranslations();

  return (
    <button
      className="icons-hover-600  gap-2 border-1 border-accent-50 hidden md:flex text-sm"
      aria-label={t("Login.ariaLabel")}
      title={t("Login.title")}
    >
      {t("Login.title")}
    </button>
  );
}

export default Login;
