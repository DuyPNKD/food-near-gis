import {navigationProps} from "./NavigationProps";
import {Category, CategoryKey} from "../libs/enums";
import useQueryStore from "../store/useQueryStore";
import useMapStore from "../store/useMapStore";

type Props = {
    onClickCategory: (categoryKey: CategoryKey, category: Category) => void;
};

export default function Navigation({onClickCategory}: Props) {
    const [setSearchQuery, setSearchResults, setSelectedSearchResult] = useQueryStore((state) => [
        state.setSearchQuery,
        state.setSearchResults,
        state.setSelectedSearchResult,
    ]);
    const clearRoute = useMapStore((state) => state.clearRoute);

    const handleClick = (categoryKey: CategoryKey, category: Category, text: string) => {
        // Xóa kết quả tìm kiếm Nominatim và route khi chuyển sang category
        setSearchResults([]);
        setSelectedSearchResult(null); // Xóa selected search result
        clearRoute(); // Xóa tuyến đường cũ
        setSearchQuery(text, true); // 👈 fromTab = true
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
