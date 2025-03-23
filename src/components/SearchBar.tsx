import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, isLoading = false }) => {
    return (
        <div className="flex flex-row items-center">
            {isLoading ? (
                <div className="animate-spin mr-2">
                    <FaSearch className="text-pink-400" />
                </div>
            ) : (
                <FaSearch className="mr-2" />
            )}
            <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="p-3 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
            />
        </div>
    );
};

export default SearchBar;
