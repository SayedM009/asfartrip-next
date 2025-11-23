// utils/headerUtils.js

/**
 * Safely parse date string "dd-mm-yyyy" → JS Date()
 */
export function parseDateString(dateStr) {
    if (!dateStr) return null;

    const parts = String(dateStr).split("-");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;

    // Convert into ISO yyyy-mm-dd for Date()
    const iso = `${year}-${month}-${day}`;
    const d = new Date(iso);

    return isNaN(d.getTime()) ? null : d;
}

/**
 * Safely parse searchObject to avoid crashing UI.
 */
export function getSafeSearchObject(params) {
    if (!params) return null;

    const raw = params.get("searchObject");
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
        return null;
    }
}
