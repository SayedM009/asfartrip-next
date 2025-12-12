export async function updateProfileClient(data) {

    const formBody = new URLSearchParams();

    for (const key in data) {
        formBody.append(key, data[key]);
    }

    const res = await fetch(`/api/dashboard/update-profile`, {
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