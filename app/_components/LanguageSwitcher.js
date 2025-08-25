"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { routing } from "@/i18n/routing";
import MyModal from "./MyModal";

function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const displayedLocal = useLocale();
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <button
        className="border-2 bg-black text-white py-2 px-2 cursor-pointer hover:bg-[#333] transition-colors flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        aria-label="Open languages list"
        title="Open languages list"
      >
        <GlobeAltIcon />
        {displayedLocal.toUpperCase()}
      </button>
      {isOpen && <DisplayLocales closeModal={closeModal} />}
    </>
  );
}

function DisplayLocales({ closeModal }) {
  const pathname = usePathname();
  const router = useRouter();
  const locales = routing.locales;

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
      <ul>
        {locales.map((locale) => (
          <button
            key={locale}
            className="w-full hover:bg-amber-400 cursor-pointer transition-colors ps-1 bg-amber-500 mb-1 flex gap-1"
            onClick={() => handleSwitch(locale)}
            aria-label={`Selecte ${locale} language`}
            title={`Selecte ${locale} language`}
          >
            <GlobeAltIcon />
            {locale.toUpperCase()}
          </button>
        ))}
      </ul>
    </MyModal>
  );
}

export default LanguageSwitcher;
