import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

function Login() {
  const t = useTranslations();

  return (
    <Button
      variant="outline"
      className="icons-hover-600   border-1  flex text-sm px-3 py-0 rounded border-gray-500"
      aria-label={t("Login.ariaLabel")}
      title={t("Login.title")}
      size="sm"
    >
      {t("Login.title")}
    </Button>
  );
}

export default Login;
