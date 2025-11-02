import {useState, useEffect} from "react";
import useQueryStore from "../store/useQueryStore";

export default function SearchBox() {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useQueryStore((state) => [state.searchQuery, state.setSearchQuery]);

    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(inputValue);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center h-10 bg-white rounded-full shadow-lg px-3 w-[300px]">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tìm kiếm địa điểm..."
                className="flex-1 text-sm outline-none"
            />
            <button type="submit" className="ml-2 h-8 px-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm">
                🔍
            </button>
        </form>
    );
}
