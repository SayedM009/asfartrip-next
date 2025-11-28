
const baseUrl =
    process.env.VERCEL_URL
        ? process.env.VERCEL_URL
        : process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000";

export async function getWebsiteConfig() {
    const res = await fetch(`${baseUrl}/api/config`, {
        cache: "no-store",
    });

    const json = await res.json();

    if (!json || json.status !== "success") {
        throw new Error(json?.message || "Failed to load website config");
    }

    return json.data;
}
