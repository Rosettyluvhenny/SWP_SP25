import React from "react";

interface SortButtonsProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({ sortBy, setSortBy }) => {
    return (
        <div className="flex space-x-2">
            {[
                { label: "Mới nhất", value: "newest" },
                { label: "Giá thấp đến cao", value: "low-high" },
                { label: "Giá cao đến thấp", value: "high-low" },
            ].map(({ label, value }) => (
                <button
                    key={value}
                    className={`px-4 py-2 rounded-md bg-white ${
                        sortBy === value ? "bg-pink-500 font-sans" : "border"
                    }`}
                    onClick={() => setSortBy(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default SortButtons;
