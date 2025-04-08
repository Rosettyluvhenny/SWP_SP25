import React from "react";

interface SortButtonsProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({ sortBy, setSortBy}) => {
    
    return (
        <div className="flex space-x-2">
            <select
            value={sortBy}
            onChange={(e)=>{setSortBy(e.target.value)
                console.log(e.target.value);
            }}
            className="px-4 py-2 rounded-md border bg-white">
            <option value ="">Sắp sếp</option>
            {[
                { label: "Mới nhất", value: "createdAt,asc" },
                { label: "Giá thấp đến cao", value: "price,asc" },
                { label: "Giá cao đến thấp", value: "price,desc" },
            ].map(({ label, value }) => (
                <option
                key={value}
                value={value}
                className={`px-4 py-2 rounded-md bg-white ${
                    sortBy === value ? "bg-pink-500 font-sans" : "border"
                }`}
                >
                    {label}
                </option>
            ))}
            </select>

        </div>
    );
};

export default SortButtons;
