import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex flex-row items-center">
            <FaSearch className="mr-2"/>
            <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="p-3 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
