export function saveRateToCookie(fromCurrency, toCurrency, rate) {
    const rateData = {
        rate,
        timestamp: Date.now(),
        from: fromCurrency,
        to: toCurrency,
    };

    const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

    document.cookie = `exchange_rate_${fromCurrency}_${toCurrency}=${JSON.stringify(
        rateData
    )}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getRateFromCookie(fromCurrency, toCurrency) {
    const cookieName = `exchange_rate_${fromCurrency}_${toCurrency}=`;
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName)) {
            try {
                const rateData = JSON.parse(
                    cookie.substring(cookieName.length)
                );

                const hourInMs = 60 * 60 * 1000;
                const timePassed = Date.now() - rateData.timestamp;

                if (timePassed < hourInMs) return rateData.rate;
                return null;
            } catch {
                return null;
            }
        }
    }
    return null;
}
