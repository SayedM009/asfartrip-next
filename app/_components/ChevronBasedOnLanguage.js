"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

function ChevronBasedOnLanguage() {
  const locale = useLocale();
  const condition = locale === "ar";
  return <>{condition ? <ChevronLeft /> : <ChevronRight />}</>;
}

export default ChevronBasedOnLanguage;
