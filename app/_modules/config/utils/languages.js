export function getActiveLanguages(languages = []) {
    return languages.filter((lng) => lng.active === "1");
}

export function getDirectionForLocale(languages, locale) {
    const lang = languages.find((l) => l.ISO2 === locale);
    return lang?.direction === "rtl" ? "rtl" : "ltr";
}
