const API = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

export async function searchAirports(term) {
  if (!term) return [];

  try {
    const res = await fetch(
      `${API}/api/flight/airports?term=${encodeURIComponent(term)}`
    );

    if (!res.ok) {
      throw new Error("Failed to search airports");
    }

    return await res.json();
  } catch (error) {
    console.error("[searchAirports] Error:", error);
    return [];
  }
}
