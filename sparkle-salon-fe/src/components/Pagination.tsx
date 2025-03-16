import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    const pageNumbers: number[] = [];

    if (currentPage === 1) {
        pageNumbers.push(currentPage);
        if (totalPages >= currentPage + 1) pageNumbers.push(currentPage + 1);
        if (totalPages >= currentPage + 2) pageNumbers.push(currentPage + 2);
    } else {
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
        <nav className="mt-4 flex justify-center mb-4">
            <ul className="flex space-x-2">
                <li>
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                        <SlArrowLeft />
                    </button>
                </li>
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            className={`w-10 h-10 flex items-center justify-center rounded-md transition ${
                                currentPage === number
                                    ? "bg-pink-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    >
                        <SlArrowRight />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
