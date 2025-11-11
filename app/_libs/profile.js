const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export async function updateProfileClient(data) {
    // نحول البيانات إلى x-www-form-urlencoded
    const formBody = new URLSearchParams();

    for (const key in data) {
        formBody.append(key, data[key]);
    }

    const res = await fetch(`${baseUrl}/api/dashboard/update-profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Unknown error");
    return result;
}

export async function fetchUserProfile({ user_id, user_type }) {
    const res = await fetch(`${baseUrl}/api/dashboard/get-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id, user_type }).toString(),
    });
    if (!res.ok) throw new Error("Failed to get profile data");
    return await res.json();
}

export async function fetchUserTravellers(user_id) {
    const res = await fetch(`${baseUrl}/api/dashboard/get-travellers`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id }).toString(),
    });
    if (!res.ok) throw new Error("Failed to get profile data");
    return await res.json();
}
