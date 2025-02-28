import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Service } from "../data/servicesData";
import servicesData from "../data/servicesData";
import SearchBar from "../components/SearchBar";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination";
import ServiceList from "../components/ServiceList";

const ITEMS_PER_PAGE = 9;

export default function Service() {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTermParam = searchParams.get("search") || "";
    const sortByParam = searchParams.get("sort") || "";
    const pageParam = Number(searchParams.get("page")) || 1;

    const [searchTerm, setSearchTerm] = useState<string>(searchTermParam);
    const [sortBy, setSortBy] = useState<string>(sortByParam);
    const [currentPage, setCurrentPage] = useState<number>(pageParam);

    useEffect(() => {
        setSearchParams({ search: searchTerm, sort: sortBy, page: currentPage.toString() });
    }, [searchTerm, sortBy, currentPage, setSearchParams]);

    const filteredServices = servicesData
        .filter((service: Service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a: Service, b: Service) => {
            if (sortBy === "newest") return b.id - a.id;
            if (sortBy === "low-high") return a.price - b.price;
            if (sortBy === "high-low") return b.price - a.price;
            return 0;
        });

    // Pagination Section   
    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-gradient-to-t from-white to-pink-200">
            {/* Page Banner Section */}
            <div className="w-full h-[170px] flex flex-row justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-10">
                <h1 className="text-white text-7xl mt-12 font-serif">Services</h1>
            </div>

            {/* Search & Sort Section */}
            <div className="flex flex-row justify-between items-center bg-pink-100 p-3 shadow-md rounded-lg mb-5">
                <SortButtons sortBy={sortBy} setSortBy={setSortBy} />
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {/* Services List */}
            <div className="max-w-6xl mx-auto">
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
