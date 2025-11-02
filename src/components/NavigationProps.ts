import {Category, CategoryKey} from "../libs/enums";
import {NavigationProps} from "../libs/types";

export const navigationProps: NavigationProps[] = [
    {
        categoryKey: CategoryKey.amenity,
        category: Category.fast_food,
        imgSrc: "./fast_food.svg",
        imgAlt: "Fast Food Icon",
        text: "Đồ ăn nhanh",
    },
    {
        categoryKey: CategoryKey.amenity,
        category: Category.cafe,
        imgSrc: "./cafe.svg",
        imgAlt: "Cafe Icon",
        text: "Quán cà phê",
    },
    {
        categoryKey: CategoryKey.amenity,
        category: Category.food_court,
        imgSrc: "./food_court.svg",
        imgAlt: "Food Court Icon",
        text: "Khu ẩm thực",
    },
    {
        categoryKey: CategoryKey.amenity,
        category: Category.bakery,
        imgSrc: "./bakery.svg",
        imgAlt: "Bakery Icon",
        text: "Tiệm bánh",
    },
];
