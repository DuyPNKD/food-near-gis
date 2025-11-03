import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {GeoPosition, MapState, MarkerIconProps} from "../libs/types";
import {defaultPosition} from "../libs/constants";
import {PositionType} from "../libs/enums";

type RouteData = {
    geometry: GeoJSON.LineString;
    distance: number; // mét
    duration: number; // giây
};

const useMapStore = create<
    MapState & {
        route: RouteData | null; // 🆕 Lưu thông tin tuyến đường
        setRoute: (route: RouteData | null) => void; // 🆕 Cập nhật tuyến đường
        clearRoute: () => void; // 🆕 Xóa tuyến đường
    }
>()(
    persist(
        (set, _get) => ({
            flyToPositionType: PositionType.default,
            position: {
                lat: defaultPosition.lat,
                lon: defaultPosition.lon,
            },
            markerIconProps: {
                imagePath: "./restaurant.svg",
                backgroundColor: "bg-orange-300",
            },

            // 🧭 setter cũ
            setPosition: (position: GeoPosition) => set({position}),
            setFlyToPositionType: (flyToType: PositionType) => set({flyToPositionType: flyToType}),
            setMarkerIconProps: (iconProps: MarkerIconProps) => set({markerIconProps: iconProps}),

            // 🆕 Chức năng chỉ đường
            route: null,
            setRoute: (route) => set({route}),
            clearRoute: () => set({route: null}),
        }),

        {
            name: "map-state-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useMapStore;
