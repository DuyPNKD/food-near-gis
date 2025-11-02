import {forwardRef, useState} from "react";
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
    {onclickCard, onShowDetails, onCloseDetails, isSelected, position, distance, id, name, opening_hours, phone, website}: Props,
    ref
) {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = (open: boolean) => {
        setShowDetails(open);
        open ? onShowDetails(id) : onCloseDetails(id);
    };

    return (
        <div
            ref={ref}
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
                <button
                    className="text-sm text-blue-600 hover:underline mt-1 self-start"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleDetails(true);
                        setShowDetails(true);
                    }}
                >
                    Xem chi tiết
                </button>
            </div>

            {/* Popup chi tiết bên phải */}
            {showDetails && (
                <div
                    className="absolute top-0 left-full ml-3 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start">
                        <h6 className="font-semibold text-gray-800">Chi tiết</h6>
                        <button
                            onClick={() => {
                                setShowDetails(false);
                            }}
                            className="text-gray-400 hover:text-gray-700"
                        >
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
                </div>
            )}
        </div>
    );
});

export default PlaceCard;
