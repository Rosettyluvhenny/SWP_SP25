import React, { useState } from "react";
import type { Service } from "../data/servicesData"; 
import servicesData from "../data/servicesData"; 
import SearchBar from "../components/SearchBar";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination";
import ServiceList from "../components/ServiceList";

const ITEMS_PER_PAGE = 9;

export default function Service() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

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

    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-gradient-to-t from-white to-pink-200">
            {/* Page Banner Section */}
            <div className="w-full h-[200px] flex flex-row justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat">
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
