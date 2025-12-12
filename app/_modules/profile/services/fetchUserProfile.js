export async function fetchUserProfile({ user_id, user_type }) {
    const res = await fetch(`/api/dashboard/get-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id, user_type }).toString(),
    });
    if (!res.ok) throw new Error("Failed to get profile data");
    return await res.json();
}
