"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  GlobeEuropeAfricaIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { routing } from "@/i18n/routing";
import MyModal from "./MyModal";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const localeNames = {
  en: "English",
  ar: "العربية",
};

function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const t = useTranslations("Languageswitcher");
  return (
    <>
      <button
        className="icons-hover-600"
        onClick={() => setIsOpen(true)}
        aria-label={t("ariaLabel")}
        title={t("title")}
      >
        <GlobeEuropeAfricaIcon />
      </button>
      {isOpen && <DisplayLocales closeModal={closeModal} />}
    </>
  );
}

function DisplayLocales({ closeModal }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split("/")[1] || "en";
  const [selected] = useState(currentLocale);
  const t = useTranslations("Languageswitcher");
  //   Handle switcher
  function handleSwitch(locale) {
    const nextLocale = locale;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  }
  return (
    <MyModal onClick={closeModal}>
      <div className="flex items-center justify-between mb-7">
        <p className="text-primary-800 font-bold">{t("regionalSettings")}</p>
        <XMarkIcon
          className="text-primary-800 cursor-pointer hover:bg-primary-800 hover:text-primary-50 transition-colors font-extrabold"
          title={t("close")}
          onClick={closeModal}
        />
      </div>
      <DisplayLaunages selected={selected} handleSwitch={handleSwitch} />
    </MyModal>
  );
}

function DisplayLaunages({ selected, handleSwitch }) {
  const locales = routing.locales;
  const t = useTranslations("Languageswitcher");
  return (
    <section className="text-primary-800 relative">
      <div className="flex gap-1 items-center">
        <ChatBubbleBottomCenterIcon />
        <p className="text-xs font-bold">{t("language")}</p>
      </div>
      <Listbox value={selected} onChange={handleSwitch}>
        <ListboxButton className="border px-3 py-1 rounded w-full cursor-pointer  mt-3 flex justify-between text-md">
          {localeNames[selected].toUpperCase()} <ChevronDownIcon />
        </ListboxButton>
        <ListboxOptions className="border mt-1 rounded absolute w-full z-50 h-full bg-white">
          {locales.map((locale) => (
            <ListboxOption
              key={locale}
              value={locale}
              className="hover:bg-primary-200 px-3 py-1 cursor-pointer text-md"
            >
              {localeNames[locale]}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </section>
  );
}

export default LanguageSwitcher;
