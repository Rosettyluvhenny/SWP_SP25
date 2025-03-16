import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Service } from "../data/servicesData";
import { servicesData } from "../data/servicesData";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination";
import ServiceList from "../components/ServiceList";

const ITEMS_PER_PAGE = 9;

export default function Service() {
    const [searchParams, setSearchParams] = useSearchParams();

    const sortByParam = searchParams.get("sort") || "";
    const pageParam = Number(searchParams.get("page")) || 1;
    const categoryParam = searchParams.get("category") || "Tất Cả";

    const [sortBy, setSortBy] = useState<string>(sortByParam);
    const [currentPage, setCurrentPage] = useState<number>(pageParam);
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<string[]>(["Tất Cả"]);

    useEffect(() => {
        setSearchParams({ sort: sortBy, page: currentPage.toString(), category: selectedCategory });
    }, [sortBy, currentPage, selectedCategory, setSearchParams]);

    const fetchServices = useCallback(async () => {
        const services = await servicesData();
        setServices(services);
        const uniqueCategories = ["Tất Cả", ...new Set(services.map((s) => s.categoryName))];
        setCategories(uniqueCategories);
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const filteredServices = services
        .filter((service) => selectedCategory === "Tất Cả" || service.categoryName === selectedCategory)
        .sort((a: Service, b: Service) => {
            switch (sortBy) {
                case "newest":
                    return b.id - a.id;
                case "low-high":
                    return a.price - b.price;
                case "high-low":
                    return b.price - a.price;
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
                    <SortButtons sortBy={sortBy} setSortBy={setSortBy} />
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-gray-600 px-4">
                    Found {filteredServices.length} services
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
