import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
export const SearchButton = ({
  onClick,
  loading = false,
  disabled = false,
  expanded = false,
  children,
  className
}) => {
  const t = useTranslations("Flight");
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200",
        expanded ? "w-full h-12 text-lg" : "h-12 px-8 min-w-[140px]",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("operations.searching")}
        </>
      ) : (
        <>
          {!children && <Search className="mr-2 h-5 w-5" />}
          {children || t("operations.search")}
        </>
      )}
    </Button>
  );
};