import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-6 space-x-2 mb-4">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    className={`px-4 py-2 rounded-md border border-black ${
                        currentPage === i + 1
                            ? "bg-pink-400 text-white font-bold"
                            : "hover:bg-pink-300"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
