import {forwardRef, useRef, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {GeoPosition} from "../libs/types";
import {THIS_IS_A_SECRET_PLACE} from "../libs/constants";
import {Clock, Phone, Globe, X} from "lucide-react";

type Props = {
    onclickCard: (position: GeoPosition) => void;
    onShowDetails: (id: string) => void;
    onCloseDetails: (id: string) => void;
    isSelected: boolean;
    position: GeoPosition;
    distance: number;
    id: string;
    name: string;
    opening_hours: string;
    phone: string;
    website: string;
    isOpen: boolean;
};

type Ref = HTMLDivElement;

const PlaceCard = forwardRef<Ref, Props>(function (
    {onclickCard, onShowDetails, onCloseDetails, isSelected, position, distance, id, name, opening_hours, phone, website, isOpen}: Props,
    ref
) {
    // ref riêng để định vị popup theo card
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [popupPos, setPopupPos] = useState<{top: number; left: number}>({top: 0, left: 0});

    // Cập nhật vị trí popup mỗi khi mở
    useEffect(() => {
        if (isOpen && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setPopupPos({
                top: rect.top,
                left: rect.right + 12, // cách 12px bên phải card
            });
        }
    }, [isOpen]);

    // Popup render ra ngoài DOM chính (tránh overflow)
    const popup =
        isOpen &&
        createPortal(
            <div
                className="fixed w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-[3000] animate-fade-in"
                style={{
                    top: popupPos.top,
                    left: popupPos.left,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h6 className="font-semibold text-gray-800">Chi tiết</h6>
                    <button onClick={() => onCloseDetails(id)} className="text-gray-400 hover:text-gray-700">
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-2 flex flex-col gap-2 text-sm text-gray-700">
                    {opening_hours && (
                        <p className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-500" />
                            {opening_hours}
                        </p>
                    )}
                    {phone && (
                        <p className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500" />
                            {phone}
                        </p>
                    )}
                    {website && (
                        <p className="flex items-center gap-2">
                            <Globe size={14} className="text-gray-500" />
                            <a
                                href={website.startsWith("http") ? website : `https://${website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                            >
                                {website}
                            </a>
                        </p>
                    )}
                </div>
            </div>,
            document.body
        );

    return (
        <div
            ref={(el) => {
                cardRef.current = el;
                if (typeof ref === "function") ref(el);
                else if (ref) (ref as any).current = el;
            }}
            id={id}
            className={`relative w-full px-2 py-3 border-b border-gray-200 cursor-pointer transition-all duration-150
            ${isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
            onClick={() => onclickCard(position)}
        >
            {/* Nội dung chính */}
            <div className="flex flex-col gap-1">
                <h5 className="font-medium text-gray-800 line-clamp-1">{name?.trim()?.length ? name : THIS_IS_A_SECRET_PLACE}</h5>
                <p className="text-sm text-gray-600">
                    Khoảng cách: <span className="font-semibold text-gray-800">{distance.toFixed(1)} km</span>
                </p>
                {!isOpen && (
                    <button
                        className="text-sm text-blue-600 hover:underline mt-1 self-start"
                        onClick={(e) => {
                            e.stopPropagation();
                            onShowDetails(id);
                        }}
                    >
                        Xem chi tiết
                    </button>
                )}
            </div>

            {popup}
        </div>
    );
});

export default PlaceCard;
