import {useState} from "react";
import PlaceCard from "./PlaceCard";
import {GeoPosition, PlaceNode} from "../libs/types";
import {distance, getCurrentDimension} from "../libs/utils";
import {largeScreenMinWidth} from "../libs/constants";
import {fetchRoute} from "../api/osrm";
import useMapStore from "../store/useMapStore";

type Props = {
    currentPosition: GeoPosition;
    places: PlaceNode[];
    selectedPosition: GeoPosition | null;
    onclickCard: (position: GeoPosition) => void;
    cardRefs: React.MutableRefObject<HTMLDivElement[]>;
    mode?: "default" | "searchResult"; // 👈 thêm dòng này
};

export default function PlaceContainer({currentPosition, places, selectedPosition, onclickCard, cardRefs, mode = "default"}: Props) {
    // const [showDetailsCards, setShowDetailsCards] = useState<string[]>([]);

    const [openCardId, setOpenCardId] = useState<string | null>(null);
    const [showStart, setShowStart] = useState(false);

    const [showEnd, setShowEnd] = useState(true);

    const setRoute = useMapStore((state) => state.setRoute);
    const clearRoute = useMapStore((state) => state.clearRoute);
    const [storePosition] = useMapStore((state) => [state.position]);

    const onShowDetails = (id: string): void => {
        setOpenCardId(id); // chỉ mở 1 card duy nhất
    };

    const onCloseDetails = (id: string): void => {
        if (openCardId === id) setOpenCardId(null);
    };
    const sortedPlaces = [...places].sort((a, b) => {
        const distA = distance(currentPosition.lat, currentPosition.lon, a.lat, a.lon);
        const distB = distance(currentPosition.lat, currentPosition.lon, b.lat, b.lon);
        return distA - distB; // tăng dần: gần nhất trước
    });
    const handleClickCard = async (position: GeoPosition) => {
        // Gọi callback gốc (đánh dấu selected card, scroll,...)
        onclickCard(position);

        // Xóa tuyến đường cũ (nếu có)
        clearRoute();

        try {
            // Gọi OSRM để lấy route mới
            const route = await fetchRoute([storePosition.lat, storePosition.lon], [position.lat, position.lon]);
            if (route) setRoute(route);
        } catch (err) {
            console.error("Không thể lấy chỉ đường:", err);
        }
    };

    return places.length > 0 ? (
        <>
            <div
                className={`${
                    mode === "searchResult"
                        ? "absolute top-[60px] left-4 z-[3000] w-[320px] max-h-[70vh] rounded-b-2xl shadow-xl bg-white"
                        : "fixed bottom-3 left-0 lg:left-3 lg:top-[54px] lg:bottom-auto lg:h-[calc(100vh-70px)] bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-[300px]"
                } flex flex-col overflow-y-auto overflow-x-visible divide-y divide-gray-200 p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
                style={{overscrollBehavior: "contain"}}
                onScroll={(event) => {
                    const target = event.target as HTMLElement;
                    const isLargeScreen = getCurrentDimension().width >= largeScreenMinWidth;

                    const isEnd: boolean = isLargeScreen
                        ? target.scrollHeight - target.scrollTop === target.clientHeight
                        : target.scrollLeft === target.scrollWidth;

                    const isStart: boolean = isLargeScreen ? target.scrollTop === 0 : target.scrollLeft === 0;

                    if (isEnd) {
                        setShowStart(true);
                        setShowEnd(false);
                    } else if (isStart) {
                        setShowStart(false);
                        setShowEnd(true);
                    } else {
                        setShowStart(true);
                        setShowEnd(true);
                    }
                }}
            >
                {sortedPlaces.map((place, index) => (
                    <PlaceCard
                        ref={(element) => {
                            if (element) cardRefs.current[index] = element;
                        }}
                        key={place.id}
                        onclickCard={handleClickCard}
                        onShowDetails={onShowDetails}
                        onCloseDetails={onCloseDetails}
                        isSelected={selectedPosition !== null && selectedPosition.lat === place.lat && selectedPosition.lon === place.lon}
                        position={{lat: place.lat, lon: place.lon}}
                        distance={distance(currentPosition.lat, currentPosition.lon, place.lat, place.lon)}
                        id={place.id.toString()}
                        name={place.tags.name}
                        opening_hours={place.tags.opening_hours}
                        phone={place.tags.phone}
                        website={place.tags.website}
                        // 👇 thêm prop mới:
                        isOpen={openCardId === place.id.toString()}
                    />
                ))}
            </div>
        </>
    ) : null;
}
