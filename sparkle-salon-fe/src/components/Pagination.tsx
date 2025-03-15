import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers: number[] = [];

  if (currentPage === 1) {
    pageNumbers.push(currentPage);
    if (totalPages >= currentPage + 1) pageNumbers.push(currentPage + 1);
    if (totalPages >= currentPage + 2) pageNumbers.push(currentPage + 2);
  } else if (currentPage > 1) {
    if (currentPage >= 3) {
      pageNumbers.push(currentPage - 2);
      pageNumbers.push(currentPage - 1);
    } else {
      pageNumbers.push(currentPage - 1);
    }
    pageNumbers.push(currentPage);
    if (totalPages >= currentPage + 1) pageNumbers.push(currentPage + 1);
    if (totalPages >= currentPage + 2) pageNumbers.push(currentPage + 2);
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center mt-6">
      <ul className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-md">
        {/* First Page Button */}
        <li>
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border border-gray-300 transition-all 
                ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            First
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md border border-gray-300 transition-all 
                ${currentPage === number ? "bg-pink-500 text-white" : "hover:bg-gray-100"}
              `}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Last Page Button */}
        <li>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border border-gray-300 transition-all 
                ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;