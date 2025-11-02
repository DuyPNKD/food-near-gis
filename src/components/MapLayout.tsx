import {useEffect, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, ZoomControl, useMap, useMapEvents} from "react-leaflet";
import {fetchPlaces} from "../api/overpass";
import Navigation from "./Navigation";
import {GeoPosition, MarkerIconProps} from "../libs/types";
import {Category, CategoryKey, PositionType} from "../libs/enums";
import {YOU_ARE_HERE, defaultPosition, displayedPlaceCount, markerIconPropsDict} from "../libs/constants";
import MapMarker from "./MapMarker";
import PlaceContainer from "./PlaceContainer";
import CustomMapMarker from "./CustomMapMarker";
import useMapStore from "../store/useMapStore";
import {LeafletMouseEvent} from "leaflet";
import Loading from "./Loading";
import ChangePositionContainer from "./ChangePositionContainer";
import {useQuery} from "@tanstack/react-query";
import useQueryStore from "../store/useQueryStore";
import SearchBox from "./SearchBox";
import {createPortal} from "react-dom";

// Component: LocationMarker
// Mục đích: quản lý vị trí hiện tại trên map (đồng bộ với store, flyTo, click để đặt vị trí)
// - Khi mount: lấy vị trí từ store và center map
// - Xử lý vị trí dựa trên flyToPositionType (user current / default / useStore)
// - Bắt sự kiện click trên map để cập nhật vị trí
type Props = {
    flyToPositionType: PositionType;
};
function LocationMarker({flyToPositionType}: Props) {
    const [storePosition, setStorePosition, setStoreFlyToPositionType] = useMapStore((state) => [
        state.position,
        state.setPosition,
        state.setFlyToPositionType,
    ]);

    const map = useMap();

    const [position, setPosition] = useState<GeoPosition>(defaultPosition);

    // Khi component mount: đồng bộ vị trí từ store và đặt view của map
    useEffect(() => {
        setPosition(storePosition);
        map.setView([storePosition.lat, storePosition.lon], map.getZoom());
    }, []);

    // Khi storePosition thay đổi => cập nhật flyToPositionType trong store
    useEffect(() => {
        setStoreFlyToPositionType(PositionType.useStore);
    }, [storePosition]);

    const flyToPosition = (latitude: number, longitude: number): void => {
        map.flyTo([latitude, longitude], map.getZoom());
        setPosition({lat: latitude, lon: longitude});
        setStorePosition({lat: latitude, lon: longitude});
    };

    // Xử lý các loại flyTo: lấy vị trí người dùng hoặc về vị trí mặc định
    useEffect(() => {
        if (flyToPositionType === PositionType.userCurrent) {
            map.locate().on("locationfound", function (e) {
                flyToPosition(e.latlng.lat, e.latlng.lng);
            });
        } else if (flyToPositionType === PositionType.default) {
            flyToPosition(defaultPosition.lat, defaultPosition.lon);
        }
    }, [map, flyToPositionType]);

    // Bắt sự kiện click trên map -> flyTo vị trí click
    useMapEvents({
        click(event) {
            flyToPosition(event.latlng.lat, event.latlng.lng);
        },
    });

    return position === null ? null : <MapMarker position={{lat: position.lat, lon: position.lon}} text={YOU_ARE_HERE} />;
}

export default function MapLayout() {
    // State local: kiểm soát kiểu flyTo và vị trí hiện tại
    const [flyToPositionType, setFlyToPositionType] = useState<PositionType>(PositionType.useStore);
    const [position, setPosition] = useState<GeoPosition>(defaultPosition);

    // Lấy category từ query store để fetch data
    const [storeCategoryKey, storeCategory, setStoreCategoryKey, setStoreCategory] = useQueryStore((state) => [
        state.categoryKey,
        state.category,
        state.setCategoryKey,
        state.setCategory,
    ]);

    // Fetch places: khi categoryKey, category hoặc position thay đổi thì gọi API
    const {data, isLoading, error} = useQuery({
        queryKey: ["fetchedPlaces", storeCategoryKey, storeCategory, position],
        queryFn: () => fetchPlaces(storeCategoryKey, storeCategory, position),
        staleTime: 10000,
    });

    // Giới hạn số place hiển thị trên UI để tránh quá nhiều marker
    const toDisplayPlaces = useMemo(() => data?.slice(0, displayedPlaceCount), [data]);

    // Lấy một số giá trị từ map store: vị trí, kiểu flyTo, marker icon props
    const [storePosition, storeFlyToPositionType, storeMarkerIconProps, setStoreFlyToPositionType, storeSetMarkerIconProps] = useMapStore((state) => [
        state.position,
        state.flyToPositionType,
        state.markerIconProps,
        state.setFlyToPositionType,
        state.setMarkerIconProps,
    ]);

    const [selectedPosition, setSelectedPosition] = useState<GeoPosition | null>(null);

    // State cho icon marker (image, màu nền)
    const [markerIconProps, setMarkerIconProps] = useState<MarkerIconProps>(markerIconPropsDict[Category.restaurant]);

    const cardRefs: React.MutableRefObject<HTMLDivElement[]> = useRef<HTMLDivElement[]>([]);

    // Khi mount: khởi tạo markerIconProps từ store
    useEffect(() => {
        setMarkerIconProps(storeMarkerIconProps);
    }, []);

    // Đồng bộ vị trí và flyToType từ store mỗi khi store thay đổi
    useEffect(() => {
        setPosition(storePosition);
        setFlyToPositionType(storeFlyToPositionType);
    }, [storePosition, storeFlyToPositionType]);

    // Handler khi click lên một custom marker trên map
    // - đánh dấu selectedPosition
    // - scroll danh sách xuống thẻ tương ứng
    const onClickCustomMapMarker = (event: LeafletMouseEvent): void => {
        setSelectedPosition({lat: event.latlng.lat, lon: event.latlng.lng});
        let cardLat: number = -1;
        let cardLng: number = -1;
        for (let i = 0; i < cardRefs.current.length; i++) {
            cardLat = +(cardRefs.current[i].getAttribute("place-position-latitude") ?? -1);
            cardLng = +(cardRefs.current[i].getAttribute("place-position-longitude") ?? -1);
            if (cardLat === event.latlng.lat && cardLng === event.latlng.lng) {
                cardRefs.current[i].scrollIntoView({
                    block: "end",
                    behavior: "smooth",
                });
                break;
            }
        }
    };

    // Handler khi thay đổi category từ Navigation
    // - cập nhật store category và thay đổi icon marker tương ứng
    const onClickCategory = (newCategoryKey: CategoryKey, newCategory: Category): void => {
        setStoreCategoryKey(newCategoryKey);
        setStoreCategory(newCategory);

        const iconProps = markerIconPropsDict[newCategory];
        setMarkerIconProps(iconProps);
        storeSetMarkerIconProps(iconProps);
    };

    // Handler thay đổi kiểu flyTo (user current / default / useStore)
    const onClickChangePosition = (positionType: PositionType): void => {
        setFlyToPositionType(positionType);
        setStoreFlyToPositionType(positionType);
    };

    // Render UI chính: MapContainer + controls + danh sách places
    return (
        <div className="w-screen h-screen z-[1] relative">
            {/* Bản đồ chính */}
            <MapContainer center={[position.lat, position.lon]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render các custom marker cho từng place hiển thị */}
                {toDisplayPlaces?.map((place) => (
                    <CustomMapMarker
                        key={place.id}
                        isCardSelected={selectedPosition !== null && selectedPosition.lat === place.lat && selectedPosition.lon === place.lon}
                        position={{lat: place.lat, lon: place.lon}}
                        text={place.tags.name}
                        imagePath={markerIconProps.imagePath}
                        backgroundColor={markerIconProps.backgroundColor}
                        onClickMarker={onClickCustomMapMarker}
                    />
                ))}

                {/* Marker vị trí hiện tại người dùng / store */}
                <LocationMarker flyToPositionType={flyToPositionType} />
                <ZoomControl position="topright" />
            </MapContainer>

            {/* Nút đổi vị trí (user current / default / store) */}
            <ChangePositionContainer onClickButton={onClickChangePosition} />

            {/* Thanh tìm kiếm + nav: đặt chung trong 1 wrapper fixed */}
            <div className="fixed top-3 left-4 z-[1000] flex items-center gap-3">
                <SearchBox /> {/* KHÔNG fixed bên trong */}
                <Navigation onClickCategory={onClickCategory} /> {/* KHÔNG fixed bên trong */}
            </div>

            {/* Danh sách kết quả: hiển thị nối liền ô tìm kiếm */}
            {/* Danh sách kết quả: hiển thị nối liền ô tìm kiếm */}
            {/* Danh sách kết quả: hiển thị nối liền ô tìm kiếm */}
            {/* Danh sách place hiển thị phía dưới */}
            <PlaceContainer
                cardRefs={cardRefs}
                currentPosition={position}
                places={toDisplayPlaces ?? []}
                selectedPosition={selectedPosition}
                onclickCard={(position) => setSelectedPosition(position)}
            />

            {/* Hiển thị loading khi fetching */}
            {isLoading ? <Loading /> : null}

            {/* Hiển thị lỗi nếu không lấy được dữ liệu */}
            {error ? <>Cannot get places data, please try again later</> : null}
        </div>
    );
}
