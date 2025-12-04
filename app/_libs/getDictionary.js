const dictionaries = {
    en: () => import('@/app/_messages/en.json').then(m => m.default),
    ar: () => import('@/app/_messages/ar.json').then(m => m.default),
};

export async function getDictionary(locale) {
    try {
        const loadDict = dictionaries[locale] || dictionaries.en;
        return await loadDict();
    } catch (err) {
        console.error(`Failed to load dictionary for locale: ${locale}`, err);
        // Fallback to English
        return await dictionaries.en();
    }
}