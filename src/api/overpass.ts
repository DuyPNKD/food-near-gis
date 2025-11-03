import {Category, CategoryKey} from "../libs/enums";
import {GeoPosition, PlaceNode} from "../libs/types";

type FetchPlacesOptions = {
    budgetOnly?: boolean;
    radius?: number;
};

// 🧭 Danh sách mirror Overpass để fallback nếu server chậm hoặc lỗi
const OVERPASS_URLS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

// 🧩 Hàm fetch với fallback tự động
async function fetchOverpass(query: string) {
    const formBody = "data=" + encodeURIComponent(query);

    for (const url of OVERPASS_URLS) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: formBody,
            });

            if (res.ok) {
                console.log("✅ Using Overpass mirror:", url);
                return await res.json();
            } else {
                console.warn("⚠️ Mirror failed:", url, res.status);
            }
        } catch (err) {
            console.warn("❌ Mirror error:", url, err);
        }
    }

    throw new Error("All Overpass mirrors failed");
}

// 🗺️ Hàm chính
export const fetchPlaces = async (
    categoryKey: CategoryKey,
    category: Category,
    position: GeoPosition,
    options: FetchPlacesOptions = {}
): Promise<PlaceNode[]> => {
    try {
        const radius = options.radius ?? 1500;

        const validKeys = ["amenity", "shop", "tourism"];
        const key = validKeys.includes(categoryKey) ? categoryKey : "amenity";

        // mở rộng sang những amenity thường rẻ cho sinh viên
        const budgetAmenities = ["fast_food", "cafe", "food_court", "bakery"];
        const amenityFilter =
            options.budgetOnly && key === "amenity" && category === "restaurant"
                ? `["amenity"~"^(${budgetAmenities.join("|")})$"]`
                : `["${key}"="${category}"]`;

        // 🧠 Cache key theo vị trí và category
        const cacheKey = `places-${key}-${category}-${position.lat.toFixed(3)}-${position.lon.toFixed(3)}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            console.log("📦 Using cached Overpass data:", cacheKey);
            return JSON.parse(cached);
        }

        const query = `
        [out:json][timeout:10];
        (
          node${amenityFilter}(around:${radius}, ${position.lat}, ${position.lon});
          way${amenityFilter}(around:${radius}, ${position.lat}, ${position.lon});
          relation${amenityFilter}(around:${radius}, ${position.lat}, ${position.lon});
        );
        out center;
        `;

        // Gọi Overpass qua hàm fallback
        const data = await fetchOverpass(query);
        console.log("fetchPlaces Response:", data);

        // Chuẩn hóa dữ liệu
        const normalized: PlaceNode[] = (data.elements ?? [])
            .map((el: any) => {
                if (el.type === "node" && el.lat != null && el.lon != null) {
                    return {
                        id: el.id,
                        lat: el.lat,
                        lon: el.lon,
                        tags: el.tags ?? {},
                        type: el.type,
                    } as PlaceNode;
                }
                if (el.center && el.center.lat != null && el.center.lon != null) {
                    return {
                        id: el.id,
                        lat: el.center.lat,
                        lon: el.center.lon,
                        tags: el.tags ?? {},
                        type: el.type,
                    } as PlaceNode;
                }
                if (el.bounds?.minlat && el.bounds?.minlon) {
                    return {
                        id: el.id,
                        lat: (el.bounds.minlat + el.bounds.maxlat) / 2,
                        lon: (el.bounds.minlon + el.bounds.maxlon) / 2,
                        tags: el.tags ?? {},
                        type: el.type,
                    } as PlaceNode;
                }
                return null;
            })
            .filter((p: PlaceNode | null): p is PlaceNode => p !== null)
            .slice(0, 100); // ✅ giới hạn 100 kết quả

        // 💾 Lưu cache cục bộ (để reload nhanh)
        sessionStorage.setItem(cacheKey, JSON.stringify(normalized));
        console.log("💾 Cached Overpass data:", cacheKey);

        return normalized;
    } catch (err) {
        console.error("❌ fetchPlaces Error:", err);
        return [];
    }
};
