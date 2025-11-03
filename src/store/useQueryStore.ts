import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {Category, CategoryKey} from "../libs/enums";
import {MapCategoryState} from "../libs/types";

interface ExtendedMapCategoryState extends MapCategoryState {
    searchQuery: string;
    isFromTab: boolean;
    searchResults: {id: string; name: string; lat: number; lon: number}[];
    selectedSearchResult: {lat: number; lon: number} | null; // 👈 thêm dòng này
    setSearchQuery: (query: string, fromTab?: boolean) => void;
    setIsFromTab: (value: boolean) => void;
    setSearchResults: (results: {id: string; name: string; lat: number; lon: number}[]) => void;
    setSelectedSearchResult: (pos: {lat: number; lon: number} | null) => void; // 👈 thêm dòng này
}

const useQueryStore = create<ExtendedMapCategoryState>()(
    persist(
        (set) => ({
            categoryKey: CategoryKey.amenity,
            category: Category.restaurant,
            searchQuery: "",
            isFromTab: false,
            searchResults: [],
            selectedSearchResult: null, // 👈 thêm
            setSearchQuery: (query, fromTab = false) => set({searchQuery: query, isFromTab: fromTab}),
            setSelectedSearchResult: (pos) => set({selectedSearchResult: pos}), // 👈 thêm
            setIsFromTab: (value) => set({isFromTab: value}),
            setSearchResults: (results) => set({searchResults: results}),
            setCategoryKey: (key: CategoryKey) => set({categoryKey: key}),
            setCategory: (category: Category) => set({category}),
        }),
        {
            name: "query-state-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useQueryStore;
