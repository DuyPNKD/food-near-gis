export async function fetchRoute(start: [number, number], end: [number, number]) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    console.log("Fetching route:", url); // 👈 thêm dòng này

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch route");
    const data = await res.json();

    console.log("OSRM data:", data); // 👈 thêm dòng này

    const route = data.routes?.[0];
    if (!route) return null;

    return {
        geometry: route.geometry,
        distance: route.distance,
        duration: route.duration,
    };
}
