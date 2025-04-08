import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { QuizResult, Service } from "../data/servicesData";
import { getQuizResult, servicesData } from "../data/servicesData";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination.tsx";
import ServiceList from "../components/ServiceList";
import { Category, CategoryData } from "../data/categoryData.ts";
import { FaSearch } from "react-icons/fa";
import { isGenerator } from "framer-motion";

export default function Service() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortByParam = searchParams.get("sort") || "";
    const [sortBy, setSortBy] = useState<string>(sortByParam);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ServicePerPage] = useState(9);
    const [totalAmountOfElements, setTotalAmountOfElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rating, setRating] = useState<number>();
    const [searchUrl, setSearchUrl] = useState("?isActive=true&size=9");
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [quizResult, setQuizResult] = useState<QuizResult[]>([]);
    const [selectedQuizResult, setSelectedQuizResult] = useState<number>();
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryData();
                const categoryList = response;
                setCategories(categoryList);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
        fetchQuizResult();
    }, []);

    const fetchServices = async () => {
        const responseJson = await servicesData(searchUrl);
        const services = responseJson.services;
        setServices(services);
        const meta = responseJson.meta;
        setTotalAmountOfElements(meta.totalElements);
        setTotalPages(meta.totalPages);
        // setIsLoading(true);
    };
    const fetchQuizResult = async () => {
        const response = await getQuizResult();
        if (response && response.result) {
            setQuizResult(response.result);
        }
    };

    useEffect(() => {
        setSearchUrl(
           `?isActive=true&${rating ? `rating=${rating}&` : ""}${selectedCategory ? `categoryId=${selectedCategory}&` : ""
            }${selectedQuizResult ? `quizResultId=${quizResult}&` : ""}${searchTerm ? `name=${searchTerm}&` : ""} page=${currentPage - 1}&size=${ServicePerPage}&sort=${sortBy}`
        );
    }, [currentPage]);

    const handleFilter = () => {
        setCurrentPage(1);
        setSearchUrl(
            `?isActive=true&${rating ? `rating=${rating}&` : ""}${selectedCategory ? `categoryId=${selectedCategory}&` : ""
            }${selectedQuizResult ? `quizResultId=${selectedQuizResult}&` : ""}${searchTerm ? `name=${searchTerm}&` : ""} page=${currentPage - 1}&size=${ServicePerPage}&sort=${sortBy}`
        );
    };
    useEffect(() => {
        fetchServices().catch((error: any) => {
            setHttpError(error.message);
        });
        window.scroll(0, 0);
    }, [searchUrl]);

    const indexOfLast: number = currentPage * ServicePerPage;
    const indexOfFirst: number = indexOfLast - ServicePerPage;
    let lastItem: number =
        ServicePerPage * currentPage <= totalAmountOfElements
            ? ServicePerPage * currentPage
            : totalAmountOfElements;
    const paginate = (pageNumber: number) => {
        console.log(pageNumber);
        setCurrentPage(pageNumber);
    };
    return (
        <div className="bg-gradient-to-t from-white to-pink-200 min-h-screen">
            {/* Banner Section */}
            <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-7xl font-serif mb-2">
                    Our Services
                </h1>
                <p className="relative z-10 text-white text-xl">
                    Discover our beauty treatments
                </p>
            </div>

            {/* Search & Filter Section */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md -mt-8 relative z-20">
                    <SortButtons sortBy={sortBy} setSortBy={setSortBy} />
                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(Number(e.target.value))
                        }
                        className="border p-2 rounded"
                    >
                        <option value="">Danh mục</option>
                        {categories &&
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                    <select
                        value={selectedQuizResult?.id}
                        onChange={(e) =>{
                            setSelectedQuizResult(Number(e.target.value))
                        }
                        }
                        className="border p-2 rounded"
                    >
                        <option value="">Loại da</option>
                        {quizResult &&
                            quizResult.map((result) => (
                                <option key={result.id} value={result.id}>
                                    {result.name}
                                </option>
                            ))}
                    </select>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border p-2 rounded"
                    >
                        <option value="">
                            Đánh Giá
                        </option>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {"⭐".repeat(star)} ({star})
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="border p-2 rounded w-full md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-violet hover:bg-gray border p-2 rounded flex flex-row items-center gap-4"
                        onClick={handleFilter}
                    >
                        <FaSearch />
                    </button>
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-gray-600 px-4">
                    {totalAmountOfElements > 0 ? (
                        <>
                            <div className="mt-3">
                                <h5>
                                    {" "}
                                    Number of results: ({totalAmountOfElements})
                                </h5>
                            </div>
                            <p>
                                {indexOfFirst + 1} to {lastItem} of{" "}
                                {totalAmountOfElements} items:
                            </p>
                        </>
                    ) : (
                        <div className="m-5">
                            <h3>Can't find what you are looking for?</h3>
                        </div>
                    )}
                </div>

                {/* Services List */}
                <ServiceList services={services} />
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </div>
        </div>
    );
}
