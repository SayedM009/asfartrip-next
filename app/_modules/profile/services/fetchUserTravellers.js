export async function fetchUserTravellers(user_id) {
    const res = await fetch(`/api/dashboard/get-travellers`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id }).toString(),
    });
    if (!res.ok) throw new Error("Failed to get profile data");
    return await res.json();
}