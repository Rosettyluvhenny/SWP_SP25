import { useEffect, useRef, useState } from "react";
import axios from "../services/customizedAxios";
import TextEditor from "./TextEditor";
import FormData from "form-data";
import { serviceDataById } from "../data/servicesData";

export interface Service {
    id: number;
    active: boolean;
    name: string;
    price: number;
    duration: string;
    session: number;
    img: string;
    description: string;
    categoryId: number;
    categoryName: string;
    rating: number;
}


type ServiceCategory = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    services: Service[];
};

const ServiceInfoForm = ({
    selectedService,
    handleCloseServiceForm,
}: {
    selectedService: string | null;
    handleCloseServiceForm: () => void;
}) => {
    const [selectedCategory, setSelectedCategory] = useState("0");
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [serviceDuration, setServiceDuration] = useState("");
    const [serviceSession, setServiceSession] = useState("");
    const [serviceDescription, setServiceDescription] = useState<string | null>(null);
    const [serviceDescriptionDefault, setServiceDescriptionDefault] = useState<string | null>(null);
    const [serviceImgUrl, setServiceImgUrl] = useState<string | null>(null);
    const [serviceImage, setServiceImage] = useState<File | null>(null);
    const quillRef = useRef(null);
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get<{ result: ServiceCategory[] }>(
                "/category"
            );
            setCategories(response.result);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        const fetchService = async (serviceId: string) => {
            if (selectedService) {
                const service = await serviceDataById(serviceId);
                console.log(service, "service")
                if (service) {
                    setServiceName(service.name);
                    setServicePrice(service.price);
                    setServiceDuration(service.duration);
                    setServiceSession(service.session);
                    setServiceDescriptionDefault(service.description);
                    setServiceDescription(service.description);
                    setServiceImgUrl(service.img);
                    setSelectedCategory(service?.categoryId || "0");
                }
            }
        };
        fetchCategories();
        if (selectedService) {
            fetchService(selectedService);
        }
    }, [selectedService]);
        
    
    const handleSaveService = async () => {
        const formData = new FormData();
        if (serviceImage) { 
            formData.append("img", serviceImage);
        }
        const data = {
            active: true,
            name: serviceName,
            price: servicePrice,
            duration: parseInt(serviceDuration),
            session: parseInt(serviceSession),
            description: serviceDescription,
            serviceCategoryId: parseInt(selectedCategory),
        };
        formData.append(
            "data",
            new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        const response = selectedService
            ? axios.put(
                  `/services/${selectedService}`,
                  formData,
                  {
                      headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "multipart/form-data;",
                      },
                  }
              )
            :  axios.post(`/services`, formData, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data;",
                  },
              });
        response.then((res) => {
            if (res.result) {
                alert("Đã lưu");
            }
            if (res.result) {
                alert("Đã lưu");
            }
            handleCloseServiceForm();
        }).catch((err) => {
            alert("Lưu thất bại");
            console.log(err, "err")
        })
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setServiceImage(file);
        }
    };

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
                    onClick={handleSaveService}
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
            <div className="flex flex-row gap-4 mt-4 justify-between w-full">
                {selectedService !== null && serviceImgUrl !== null ? (
                    <div className="flex flex-row gap-2 items-center w-full">
                        <img
                            src={serviceImgUrl + "?timestamp=" + new Date().getTime()}
                            alt="Service Image"
                            className="h-[74px] rounded-md"
                        />
                        <button
                            className="text-blue-400"
                            onClick={() => setServiceImgUrl(null)}
                        >
                            Thay đổi ảnh
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <span className="flex flex-col w-full">
                            <label className="pr-2" htmlFor="name">
                                Hình ảnh
                            </label>
                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="image"
                                className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2"
                            />
                        </span>
                    </div>
                )}

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
                        {categories.map((category) => (
                            <option key={category.id} id={category.id.toString()} value={category.id.toString()}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </span>
            </div>
            <div className="mt-4">
                <TextEditor
                    ref={quillRef}
                    defaultValue={serviceDescriptionDefault}
                    onTextChange={setServiceDescription}
                />
            </div>
        </div>
    );
};

export default ServiceInfoForm;
