export async function searchAirports(term) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

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
