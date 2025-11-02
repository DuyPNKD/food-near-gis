import {Category} from "./enums";
import {GeoPosition, MarkerIconProps} from "./types";

export const defaultPosition = {lat: 21.0277644, lon: 105.8341598}; // Hà Nội, VN

export const YOU_ARE_HERE = "You are here";
export const THIS_IS_A_SECRET_PLACE = "This is a secret place";
export const displayedPlaceCount = 10;

// Các loại địa điểm chính bạn đang dùng
export const markerIconPropsDict: {[key: string]: MarkerIconProps} = {
    [Category.fast_food]: {
        imagePath: "/fast_food.svg",
        backgroundColor: "#F97316", // cam
    },
    [Category.cafe]: {
        imagePath: "/cafe.svg",
        backgroundColor: "#A855F7", // tím
    },
    [Category.food_court]: {
        imagePath: "/food_court.svg",
        backgroundColor: "#10B981", // xanh lá
    },
    [Category.bakery]: {
        imagePath: "/bakery.svg",
        backgroundColor: "#EAB308", // vàng
    },
};

export const largeScreenMinWidth = 1024;
