import {navigationProps} from "./NavigationProps";
import {Category, CategoryKey} from "../libs/enums";
import useQueryStore from "../store/useQueryStore";

type Props = {
    onClickCategory: (categoryKey: CategoryKey, category: Category) => void;
};

export default function Navigation({onClickCategory}: Props) {
    const setSearchQuery = useQueryStore((state) => state.setSearchQuery);

    const handleClick = (categoryKey: CategoryKey, category: Category, text: string) => {
        setSearchQuery(text); // Hiển thị text tab vào ô tìm kiếm
        onClickCategory(categoryKey, category);
    };

    return (
        <nav className="flex items-center gap-3">
            {navigationProps.map(({categoryKey, category, imgSrc, imgAlt, text}, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => handleClick(categoryKey, category, text)}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-full
                     bg-gray-100 border border-gray-300 shadow
                     hover:bg-gray-200 text-sm"
                >
                    <img src={imgSrc} alt={imgAlt} className="w-5 h-5 object-contain" />
                    <span className="hidden md:inline">{text}</span>
                </button>
            ))}
        </nav>
    );
}
