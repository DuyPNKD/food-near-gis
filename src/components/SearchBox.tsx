import {useState, useEffect} from "react";
import useQueryStore from "../store/useQueryStore";
import {searchPlaces} from "../api/nominatim";

export default function SearchBox() {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery, isFromTab, setIsFromTab, setSearchResults] = useQueryStore((state) => [
        state.searchQuery,
        state.setSearchQuery,
        state.isFromTab,
        state.setIsFromTab,
        state.setSearchResults,
    ]);

    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Nếu người dùng tự gõ lại thì cho phép search Nominatim
        if (isFromTab) {
            console.log("Tìm kiếm từ tab — dùng Overpass / cơ chế cũ");
            setIsFromTab(false);
        }

        setSearchQuery(inputValue, false);

        // Nếu có query thì search Nominatim, nếu không thì clear results
        if (inputValue.trim()) {
            try {
                const data = await searchPlaces(inputValue);
                setSearchResults(data);
                console.log("Kết quả Nominatim:", data);
            } catch (err) {
                console.error(err);
                setSearchResults([]);
            }
        } else {
            // Nếu query trống thì clear results
            setSearchResults([]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center h-10 bg-white rounded-full shadow-sm px-2 w-[320px] transition-all">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsFromTab(false); // đánh dấu đây là nhập tay, cho phép submit tìm kiếm
                }}
                placeholder="Tìm kiếm địa điểm..."
                className="flex-1 text-sm bg-transparent border-0 outline-none placeholder-gray-400 px-3 focus:outline-none focus:ring-0"
            />
            <button
                type="submit"
                aria-label="Tìm kiếm"
                className="ml-2 h-8 w-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors border-0 focus:outline-none focus:ring-0"
            >
                🔍
            </button>
        </form>
    );
}
