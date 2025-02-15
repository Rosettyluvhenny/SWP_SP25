import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillFrown } from "react-icons/ai";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import SortButtons from "../components/SortButton";
import Pagination from "../components/Pagination";

const services = [
    {
        id: 1,
        name: "Điều Trị Mụn Chuyên Sâu 12 bước",
        img: "",
        price: 150000,
        duration: "7 phút",
        popularity: 765826,
    },
    {
        id: 2,
        name: "Thải Độc Da Thảo Dược",
        img: "",
        price: 200000,
        duration: "30 phút",
        popularity: 13373,
    },
    {
        id: 3,
        name: "Điều Trị Nám Da",
        img: "",
        price: 550000,
        duration: "1 Lần",
        popularity: 97050,
    },
    {
        id: 4,
        name: "Điều Trị Tàn Nhang",
        img: "",
        price: 300000,
        duration: "45 phút",
        popularity: 50000,
    },
    {
        id: 5,
        name: "Điều Trị Sẹo Rỗ",
        img: "",
        price: 250000,
        duration: "1 Giờ",
        popularity: 89000,
    },
    {
        id: 6,
        name: "Điều Trị Da Nhờn",
        img: "",
        price: 600000,
        duration: "90 phút",
        popularity: 65000,
    },
    {
        id: 7,
        name: "Điều Trị Lão Hóa Da",
        img: "",
        price: 100000,
        duration: "40 phút",
        popularity: 43000,
    },
    {
        id: 8,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 9,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 10,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 11,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 12,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 13,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 14,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 15,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 16,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 17,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
    {
        id: 18,
        name: "Điều Trị Mụn",
        img: "",
        price: 500000,
        duration: "1 Giờ",
        popularity: 75000,
    },
];

const ITEMS_PER_PAGE = 9;

export default function Service() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const handleSelectService = (serviceName: string) => {
        navigate("/contact", { state: { selectedService: serviceName } });
    };

    const filteredServices = services
        .filter((service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
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
            <div className="w-full h-[200px]  flex flex-row justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat">
                <h1 className="text-white text-7xl mt-12 font-serif">
                    Services
                </h1>
            </div>

            {/* Search & Sort Section */}
            <div className="flex flex-row justify-between items-center bg-pink-100 p-3 shadow-md rounded-lg mb-5">
                <SortButtons sortBy={sortBy} setSortBy={setSortBy} />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>
            
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {paginatedServices.length > 0 ? (
                        paginatedServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onSelect={handleSelectService}
                            />
                        ))
                    ) : (
                        <div className="grid place-items-center col-span-3 h-80">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-gray-500 text-center text-2xl">
                                    Không tìm thấy dịch vụ nào
                                </p>
                                <AiFillFrown className="text-9xl text-gray-400 mt-2" />
                            </div>
                        </div>
                    )}
                </div>

                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}
