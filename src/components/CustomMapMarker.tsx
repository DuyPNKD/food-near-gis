import {Marker, Popup} from "react-leaflet";
import {GeoPosition} from "../libs/types";
import {renderToStaticMarkup} from "react-dom/server";
import {LeafletMouseEvent, divIcon} from "leaflet";
import {THIS_IS_A_SECRET_PLACE} from "../libs/constants";

type Props = {
    isCardSelected: boolean;
    position: GeoPosition;
    text: string;
    imagePath: string; // có thể rỗng
    backgroundColor: string; // mã HEX, ví dụ "#3B82F6"
    onClickMarker: (event: LeafletMouseEvent) => void;
};

export default function CustomMapMarker({isCardSelected, position, text, imagePath, backgroundColor, onClickMarker}: Props) {
    // Kích thước marker rõ ràng (px)
    const size = isCardSelected ? 48 : 32;

    // HTML cho divIcon: dùng inline-style cho màu nền + kích thước cố định
    const iconMarkup = renderToStaticMarkup(
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor, // ✅ dùng HEX trực tiếp
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                transform: "translate(-50%, -100%)", // đưa mũi marker về đúng điểm neo
            }}
        >
            {imagePath ? (
                <img src={imagePath} alt={text || "marker"} style={{width: "70%", height: "70%", objectFit: "contain"}} />
            ) : (
                // Fallback nếu không có ảnh: chấm tròn trắng
                <div
                    style={{
                        width: "50%",
                        height: "50%",
                        borderRadius: "9999px",
                        background: "white",
                    }}
                />
            )}
        </div>
    );

    const customMarkerIcon = divIcon({
        html: iconMarkup,
        className: "", // bỏ class mặc định để tránh CSS lạ
        iconSize: [size, size], // ✅ kích thước click/hiển thị
        iconAnchor: [size / 2, size], // ✅ neo tại đáy (điểm vị trí)
        popupAnchor: [0, -size], // popup xuất hiện phía trên
    });

    return (
        <Marker
            position={[position.lat, position.lon]}
            icon={customMarkerIcon}
            eventHandlers={{
                click: (e) => onClickMarker(e),
            }}
            // zIndexOffset giúp marker nổi lên nếu bị chồng
            zIndexOffset={isCardSelected ? 1000 : 0}
        >
            <Popup>{!text || text.trim().length <= 0 ? THIS_IS_A_SECRET_PLACE : text}</Popup>
        </Marker>
    );
}
