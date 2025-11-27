export async function getWebsiteConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const res = await fetch(`${baseUrl}/api/config`, {
        cache: "no-store",
    });

    const json = await res.json();

    console.log(json)


    if (!json || json.status !== "success") {
        throw new Error("Failed to load website config");
    }

    return json.data;
}
