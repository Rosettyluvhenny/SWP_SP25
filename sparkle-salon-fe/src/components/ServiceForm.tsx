import { useEffect, useState } from "react";
import QuillTest from "./QuillTest";
import axios from "axios";


type Service = {
    id: number;
    name: string;
    price: string;
    status: string;
    category: string;
};

type ServiceCategory = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    services: Service[];
};

const ServiceInfoForm = ({
    handleCloseServiceForm,
}: {
    handleCloseServiceForm: () => void;
}) => {
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [serviceDuration, setServiceDuration] = useState("");
    const [serviceSession, setServiceSession] = useState("");
    const [serviceImage, setServiceImage] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await axios.get<{ result: ServiceCategory[] }>(
                "http://localhost:8081/swp/category"
            );
            setCategories(response.data.result);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-pink-400">Tạo Dịch Vụ</h1>
            <div className="flex flex-row gap-4 mt-4 ">
                <button
                    className="bg-gray-400 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md"
                    onClick={handleCloseServiceForm}
                >
                    Close
                </button>
                <button
                    className="bg-pink-400 text-white px-4 py-2 rounded-md"
                    onClick={handleCloseServiceForm}
                >
                    Save
                </button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="name">
                        Tên Dịch Vụ
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2 w-full"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                    />
                </span>
            </div>
            <div className="flex flex-row gap-4 mt-4 justify-between">
                <div className="flex flex-col gap-2">
                    <span className="flex flex-col w-full">
                        <label className="pr-2" htmlFor="name">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            id="image"
                            className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2"
                            value={serviceImage}
                            onChange={(e) => setServiceImage(e.target.value)}
                        />
                    </span>
                </div>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="duration">
                        Thời Lượng
                    </label>
                    <input
                        type="text"
                        id="duration"
                        className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2"
                        value={serviceDuration}
                        onChange={(e) => setServiceDuration(e.target.value)}
                    />
                </span>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="session">
                        Số Buổi
                    </label>
                    <input
                        type="text"
                        id="session"
                        className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2"
                        value={serviceSession}
                        onChange={(e) => setServiceSession(e.target.value)}
                    />
                </span>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="price">
                        Giá
                    </label>
                    <input
                        type="text"
                        id="price"
                        className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2"
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                    />
                </span>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="price">
                        Danh Mục
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-[50px]"
                    >
                        <option value="0">Chọn Danh Mục</option>
                        {categories
                            .map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </span>
            </div>
            <QuillTest />
        </div>
    );
};

export default ServiceInfoForm;
