export function encodeBase64(value) {
    // ترميز أول مرة
    const once =
        typeof window !== "undefined"
            ? btoa(value.toString())
            : Buffer.from(value.toString()).toString("base64");

    // ترميز ثاني مرة (Double Encoding)
    return typeof window !== "undefined"
        ? btoa(once)
        : Buffer.from(once).toString("base64");
}

export function decodeBase64(value) {
    if (typeof window !== "undefined") return atob(value);
    return Buffer.from(value, "base64").toString("utf-8");
}
