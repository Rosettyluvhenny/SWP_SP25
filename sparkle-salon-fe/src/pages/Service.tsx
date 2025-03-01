import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FrontendService, mapServiceToFrontendService } from "../types/service.types";
import { getAllServices, getAllServiceCategories } from "../api/serviceApi";
import SearchBar from "../components/SearchBar";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination";
import ServiceList from "../components/ServiceList";
import { debounce } from 'lodash';
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 9;

export default function Service() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTermParam = searchParams.get("search") || "";
    const sortByParam = searchParams.get("sort") || "";
    const pageParam = Number(searchParams.get("page")) || 1;
    const categoryParam = searchParams.get("category") || "all";

    const [searchTerm, setSearchTerm] = useState<string>(searchTermParam);
    const [sortBy, setSortBy] = useState<string>(sortByParam);
    const [currentPage, setCurrentPage] = useState<number>(pageParam);
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<FrontendService[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    // Fetch services and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch services
                const servicesData = await getAllServices();
                const frontendServices = servicesData.map(mapServiceToFrontendService);
                setServices(frontendServices);
                
                // Fetch categories
                const categoriesData = await getAllServiceCategories();
                const categoryNames = categoriesData.map(cat => cat.name);
                setCategories(categoryNames);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        setSearchParams({ 
            search: searchTerm, 
            sort: sortBy, 
            page: currentPage.toString(),
            category: selectedCategory
        });
    }, [searchTerm, sortBy, currentPage, selectedCategory, setSearchParams]);

    const debouncedSearch = debounce((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); 
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300);
    }, 300);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const filteredServices = services
        .filter((service: FrontendService) => {
            const searchLower = searchTerm.toLowerCase();
            const categoryMatch = selectedCategory === "all" || service.category === selectedCategory;
            
            return (
                categoryMatch && (
                    service.name.toLowerCase().includes(searchLower) ||
                    (service.category?.toLowerCase().includes(searchLower)) ||
                    (service.description?.toLowerCase().includes(searchLower))
                )
            );
        })
        .sort((a: FrontendService, b: FrontendService) => {
            switch (sortBy) {
                case "newest":
                    return b.id - a.id;
                case "low-high":
                    return a.price - b.price;
                case "high-low":
                    return b.price - a.price;
                case "popularity":
                    return b.popularity - a.popularity;
                default:
                    return 0;
            }
        });

    // Pagination Section   
    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-gradient-to-t from-white to-pink-200 min-h-screen">
            {/* Banner Section */}
            <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-7xl font-serif mb-2">Our Services</h1>
                <p className="relative z-10 text-white text-xl">Discover our beauty treatments</p>
            </div>

            {/* Search & Filter Section */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md -mt-8 relative z-20">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => handleCategoryChange("all")}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedCategory === "all" 
                                ? "bg-pink-500 text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button 
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    selectedCategory === category 
                                    ? "bg-pink-500 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <SortButtons sortBy={sortBy} setSortBy={setSortBy} />
                        <SearchBar 
                            searchTerm={searchTerm} 
                            setSearchTerm={debouncedSearch}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-gray-600 px-4">
                    Found {filteredServices.length} services
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                </div>

                {/* Services List */}
                <ServiceList services={paginatedServices} />
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}