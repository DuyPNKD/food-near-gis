import {useState} from "react";
import useQueryStore from "../store/useQueryStore";
import useMapStore from "../store/useMapStore";
import {fetchRoute} from "../api/osrm";

type SearchResult = {
    id: string;
    name: string;
    lat: number;
    lon: number;
    address?: Record<string, string>;
};

export default function SearchResultList() {
    const searchResults = useQueryStore((state) => state.searchResults) as SearchResult[];
    const setSelectedSearchResult = useQueryStore((state) => state.setSelectedSearchResult);
    const position = useMapStore((state) => state.position);
    const setRoute = useMapStore((state) => state.setRoute);
    const [loadingRouteId, setLoadingRouteId] = useState<string | null>(null);

    if (searchResults.length === 0) return null;

    const handleClickResult = async (r: SearchResult) => {
        // Lưu vị trí được chọn vào store
        setSelectedSearchResult({lat: r.lat, lon: r.lon});

        // Tính toán tuyến đường từ vị trí hiện tại đến địa điểm được chọn
        try {
            setLoadingRouteId(r.id);
            const start: [number, number] = [position.lat, position.lon];
            const end: [number, number] = [r.lat, r.lon];

            const routeData = await fetchRoute(start, end);
            if (routeData) {
                setRoute(routeData);
                console.log("✅ Route calculated:", routeData);
            } else {
                console.warn("⚠️ No route found");
                setRoute(null);
            }
        } catch (error) {
            console.error("❌ Error fetching route:", error);
            setRoute(null);
        } finally {
            setLoadingRouteId(null);
        }
    };

    return (
        <ul className="absolute top-[56px] left-4 w-[320px] bg-white shadow-lg rounded-lg overflow-hidden z-[1100] text-sm max-h-[70vh] overflow-y-auto">
            {searchResults.map((r) => (
                <li
                    key={r.id}
                    onClick={() => handleClickResult(r)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                        loadingRouteId === r.id ? "opacity-60 pointer-events-none" : ""
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-medium">{r.name}</p>
                            {r.address && <p className="text-xs text-gray-500 truncate">{Object.values(r.address).join(", ")}</p>}
                        </div>
                        {loadingRouteId === r.id && (
                            <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
