import useQueryStore from "../store/useQueryStore";

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

    if (searchResults.length === 0) return null;

    const handleClickResult = (r: SearchResult) => {
        // Lưu vị trí được chọn vào store
        setSelectedSearchResult({lat: r.lat, lon: r.lon});
    };

    return (
        <ul className="absolute top-[56px] left-4 w-[320px] bg-white shadow-lg rounded-lg overflow-hidden z-[1100] text-sm max-h-[70vh] overflow-y-auto">
            {searchResults.map((r) => (
                <li key={r.id} onClick={() => handleClickResult(r)} className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
                    <p className="font-medium">{r.name}</p>
                    {r.address && <p className="text-xs text-gray-500 truncate">{Object.values(r.address).join(", ")}</p>}
                </li>
            ))}
        </ul>
    );
}
