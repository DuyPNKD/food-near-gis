export async function searchPlaces(query: string) {
    if (!query.trim()) return [];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10`;

    const response = await fetch(url, {
        headers: {
            "Accept-Language": "vi",
            "User-Agent": "MyMapApp/1.0 (your-email@example.com)", // Bắt buộc theo policy của Nominatim
        },
    });

    if (!response.ok) throw new Error("Failed to fetch places");

    const data = await response.json();

    return data.map((item: any) => ({
        id: item.place_id,
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        address: item.address,
    }));
}
