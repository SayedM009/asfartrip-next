import { headers } from "next/headers";

export function getOrigin() {
    const h = headers();
    const host = h.get("host");
    const protocol = h.get("x-forwarded-proto") || "https";
    return `${protocol}://${host}`;
}
