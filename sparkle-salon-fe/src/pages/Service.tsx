import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Service } from "../data/servicesData";
import { servicesData } from "../data/servicesData";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination.tsx";
import ServiceList from "../components/ServiceList";
import { Category, CategoryData } from "../data/categoryData.ts";

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
    const [searchUrl, setSearchUrl] = useState('?size=9');
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryData();
                const categoryList = response.content;
                setCategories(categoryList);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
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
    useEffect(() => {
        setSearchUrl(
            `?${rating ? `rating=${rating}&` : ""}${selectedCategory ? `categoryId=${selectedCategory}&` : ""}page=${currentPage-1}&size=${ServicePerPage}&sort=${sortBy}`
        );
    }, [currentPage]);

    const handleFilter = () => {
        setCurrentPage(1);
        setSearchUrl(
            `?${rating ? `rating=${rating}&` : ""}${selectedCategory ? `categoryId=${selectedCategory}&` : ""}page=${currentPage-1}&size=${ServicePerPage}&sort=${sortBy}`
        );
    }
    useEffect(() => {
        fetchServices().catch((error: any) => {
            setHttpError(error.message);

        })
        window.scroll(0, 0);;
    }, [currentPage,searchUrl]);

    const indexOfLast: number = currentPage * ServicePerPage;
    const indexOfFirst: number = indexOfLast - ServicePerPage;
    let lastItem: number =
        ServicePerPage * currentPage <= totalAmountOfElements
            ? ServicePerPage * currentPage
            : totalAmountOfElements
    const paginate = (pageNumber: number) => {
        console.log(pageNumber);
        setCurrentPage(pageNumber)};
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
                        onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        className="border p-2 rounded"
                    >
                        <option value="">Select a Category</option>
                        {categories && categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value="">Select a Rating</option>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {"⭐".repeat(star)} ({star})

                                
                            </option>
                            
                        ))}
                    </select>
                    <button className="bg-violet hover:bg-gray" onClick={handleFilter}>Search</button>

                </div>

                {/* Results Summary */}
                <div className="mt-4 text-gray-600 px-4">
                    {totalAmountOfElements > 0 ? (
                        <>
                            <div className="mt-3">
                                <h5> Number of results: ({totalAmountOfElements})</h5>
                            </div>
                            <p>
                                {indexOfFirst + 1} to {lastItem} of {totalAmountOfElements}{" "}
                                items:
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
