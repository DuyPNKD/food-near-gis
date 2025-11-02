import {Category, CategoryKey} from "../libs/enums";
import {GeoPosition, PlaceNode} from "../libs/types";

const BASE_URL = "https://overpass.kumi.systems/api/interpreter"; // ổn định hơn

type FetchPlacesOptions = {
    budgetOnly?: boolean;
    radius?: number;
};

export const fetchPlaces = async (
    categoryKey: CategoryKey,
    category: Category,
    position: GeoPosition,
    options: FetchPlacesOptions = {}
): Promise<PlaceNode[]> => {
    try {
        const radius = options.radius ?? 5000;

        const validKeys = ["amenity", "shop", "tourism"];
        const key = validKeys.includes(categoryKey) ? categoryKey : "amenity";

        // mở rộng sang những amenity thường rẻ cho sinh viên
        const budgetAmenities = ["fast_food", "cafe", "food_court", "bakery"];
        const amenityFilter =
            options.budgetOnly && key === "amenity" && category === "restaurant"
                ? `["amenity"~"^(${budgetAmenities.join("|")})$"]`
                : `["${key}"="${category}"]`;

        const query = `
        [out:json][timeout:25];
        (
          node${amenityFilter}(around:${radius}, ${position.lat}, ${position.lon});
          way${amenityFilter}(around:${radius}, ${position.lat}, ${position.lon});
          relation${amenityFilter}(around:${radius}, ${position.lat}, ${position.lon});
        );
        out center;
      `;

        const formBody = "data=" + encodeURIComponent(query);
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: formBody,
        });

        const data = await response.json();
        console.log("fetchPlaces Response:", data);

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

                // thêm fallback nếu node không có center mà có bounds
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
            .filter((p: PlaceNode | null): p is PlaceNode => p !== null);

        return normalized;
    } catch (err) {
        console.error(`fetchPlaces Error: ${JSON.stringify(err)}`);
        return [];
    }
};
// https://overpass-api.de/api/interpreter?data=[out:json];%20%20%20%20%20%20node%20%20%20%20%20%20%20%20[amenity=college]%20%20%20%20%20%20%20%20(48.835474119784756,2.3644745349884033,48.874784201649106,2.407475709915161);%20%20%20%20%20%20out;
