import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {Category, CategoryKey} from "../libs/enums";
import {MapCategoryState} from "../libs/types";

interface ExtendedMapCategoryState extends MapCategoryState {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const useQueryStore = create<ExtendedMapCategoryState>()(
    persist(
        (set, _get) => ({
            categoryKey: CategoryKey.amenity,
            category: Category.restaurant,
            searchQuery: "",
            setSearchQuery: (query) => set({searchQuery: query}),
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
