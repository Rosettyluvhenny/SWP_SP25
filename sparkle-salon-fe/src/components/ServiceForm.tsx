import { useState } from "react";
import QuillTest from "./QuillTest";

const categoryOptions = [
    "Tất Cả",
    "Chăm Sóc Da",
    "Trị Liệu",
    "Dịch Vụ Khác",
];

const ServiceInfoForm = ({
    handleCloseServiceForm,
}: {
    handleCloseServiceForm: () => void;
}) => {
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
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
                        {categoryOptions
                            .filter((cat) => cat !== "Tất Cả")
                            .map((category) => (
                                <option key={category} value={category}>
                                    {category}
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
