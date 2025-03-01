import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Service } from "../types/service";
import SearchBar from "../components/SearchBar";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination";
import ServiceList from "../components/ServiceList";
import { debounce } from 'lodash';
import { servicesApi } from "../api";
import { adaptServicesToFrontend } from "../utils/serviceAdapter";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 9;

export default function Service() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTermParam = searchParams.get("search") || "";
    const sortByParam = searchParams.get("sort") || "";
    const pageParam = Number(searchParams.get("page")) || 1;

    const [searchTerm, setSearchTerm] = useState<string>(searchTermParam);
    const [sortBy, setSortBy] = useState<string>(sortByParam);
    const [currentPage, setCurrentPage] = useState<number>(pageParam);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch services from API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching services from API...");
                const apiServices = await servicesApi.getAll();
                console.log("API response:", apiServices);
                
                if (!apiServices || apiServices.length === 0) {
                    console.warn("API returned empty services array");
                    setServices([]);
                    setError("Không có dịch vụ nào trong cơ sở dữ liệu. Vui lòng thêm dịch vụ trước.");
                    toast.warning("Không có dịch vụ nào trong cơ sở dữ liệu");
                } else {
                    const adaptedServices = adaptServicesToFrontend(apiServices);
                    console.log("Adapted services:", adaptedServices);
                    setServices(adaptedServices);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching services:", err);
                setServices([]);
                
                if (err instanceof Error) {
                    setError(`Không thể tải dữ liệu dịch vụ: ${err.message}`);
                    toast.error(`Không thể tải dữ liệu dịch vụ: ${err.message}`);
                } else {
                    setError("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
                    toast.error("Không thể tải dữ liệu dịch vụ");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        setSearchParams({ search: searchTerm, sort: sortBy, page: currentPage.toString() });
    }, [searchTerm, sortBy, currentPage, setSearchParams]);

    const debouncedSearch = debounce((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); 
    }, 300);

    const filteredServices = services
        .filter((service: Service) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                service.name.toLowerCase().includes(searchLower) ||
                (service.category?.toLowerCase().includes(searchLower)) ||
                (service.description?.toLowerCase().includes(searchLower))
            );
        })
        .sort((a: Service, b: Service) => {
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
                    <SortButtons sortBy={sortBy} setSortBy={setSortBy} />
                    <SearchBar 
                        searchTerm={searchTerm} 
                        setSearchTerm={debouncedSearch}
                        isLoading={isLoading}
                    />
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-gray-600 px-4">
                    Found {filteredServices.length} services
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Services List */}
                <ServiceList services={paginatedServices} isLoading={isLoading} />
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}