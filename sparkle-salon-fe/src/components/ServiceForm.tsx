import { useEffect, useRef, useState } from "react";
import axios from "../services/customizedAxios";
import TextEditor from "./TextEditor";
import FormData from "form-data";
import { serviceDataById } from "../data/servicesData";
import { toast } from "react-toastify";

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

// New validation error interface
interface ValidationErrors {
    serviceName: string;
    servicePrice: string;
    serviceDuration: string;
    serviceSession: string;
    serviceDescription: string;
    selectedCategory: string;
    serviceImage: string;
}

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
    
    // Add validation errors state
    const [errors, setErrors] = useState<ValidationErrors>({
        serviceName: "",
        servicePrice: "",
        serviceDuration: "",
        serviceSession: "",
        serviceDescription: "",
        selectedCategory: "",
        serviceImage: ""
    });
    
    // Add form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
    
    // Add validation function
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {
            serviceName: "",
            servicePrice: "",
            serviceDuration: "",
            serviceSession: "",
            serviceDescription: "",
            selectedCategory: "",
            serviceImage: ""
        };
        
        let isValid = true;
        
        // Validate service name
        if (!serviceName.trim()) {
            newErrors.serviceName = "Tên dịch vụ không được để trống";
            isValid = false;
        } else if (serviceName.length < 3) {
            newErrors.serviceName = "Tên dịch vụ phải có ít nhất 3 ký tự";
            isValid = false;
        }
        
        // Validate price
        if (!servicePrice) {
            newErrors.servicePrice = "Giá không được để trống";
            isValid = false;
        } else if (isNaN(Number(servicePrice)) || Number(servicePrice) <= 0) {
            newErrors.servicePrice = "Giá phải là số dương";
            isValid = false;
        }
        
        // Validate duration
        if (!serviceDuration) {
            newErrors.serviceDuration = "Thời lượng không được để trống";
            isValid = false;
        } else if (isNaN(Number(serviceDuration)) || Number(serviceDuration) <= 0) {
            newErrors.serviceDuration = "Thời lượng phải là số dương";
            isValid = false;
        }
        
        // Validate session
        if (!serviceSession) {
            newErrors.serviceSession = "Số buổi không được để trống";
            isValid = false;
        } else if (isNaN(Number(serviceSession)) || Number(serviceSession) <= 0 || !Number.isInteger(Number(serviceSession))) {
            newErrors.serviceSession = "Số buổi phải là số nguyên dương";
            isValid = false;
        }
        
        // Validate description
        if (!serviceDescription || serviceDescription.trim() === '' || serviceDescription === '<p><br></p>') {
            newErrors.serviceDescription = "Mô tả không được để trống";
            isValid = false;
        }
        
        // Validate category
        if (selectedCategory === "0") {
            newErrors.selectedCategory = "Vui lòng chọn danh mục";
            isValid = false;
        }
        
        // Validate image (only for new services)
        if (!selectedService && !serviceImage) {
            newErrors.serviceImage = "Vui lòng chọn hình ảnh";
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };
    
    const handleSaveService = async () => {
        // First, validate the form
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin");
            return;
        }
        
        setIsSubmitting(true);
        
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
        
        try {
            const response = selectedService
                ? await axios.put(
                      `/services/${selectedService}`,
                      formData,
                      {
                          headers: {
                                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "multipart/form-data;",
                          },
                      }
                  )
                : await axios.post(`/services`, formData, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "multipart/form-data;",
                      },
                  });
            
            if (response.result) {
                toast.success("Đã lưu");
                handleCloseServiceForm();
            }
        } catch (err) {
            toast.error("Lưu thất bại");
            console.log(err, "err");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    serviceImage: "Kích thước hình ảnh không được vượt quá 5MB"
                }));
                return;
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    serviceImage: "Chỉ chấp nhận các định dạng: JPG, PNG, WEBP"
                }));
                return;
            }
            
            setServiceImage(file);
            setErrors(prev => ({
                ...prev,
                serviceImage: ""
            }));
        }
    };

    // Error message component for reuse
    const ErrorMessage = ({ message }: { message: string }) => {
        return message ? (
            <p className="text-red-500 text-sm mt-1">{message}</p>
        ) : null;
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-pink-400">
                {selectedService ? "Cập Nhật Dịch Vụ" : "Tạo Dịch Vụ"}
            </h1>
            <div className="flex flex-row gap-4 mt-4">
                <button
                    className="bg-gray-400 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md"
                    onClick={handleCloseServiceForm}
                    disabled={isSubmitting}
                >
                    Close
                </button>
                <button
                    className={`bg-pink-400 text-white px-4 py-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-500'}`}
                    onClick={handleSaveService}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang lưu..." : "Save"}
                </button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="name">
                        Tên Dịch Vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`border-2 ${errors.serviceName ? 'border-red-500' : 'border-gray-300'} h-[50px] rounded-md px-4 py-2 w-full`}
                        value={serviceName}
                        onChange={(e) => {
                            setServiceName(e.target.value);
                            if (e.target.value.trim()) {
                                setErrors(prev => ({...prev, serviceName: ""}));
                            }
                        }}
                    />
                    <ErrorMessage message={errors.serviceName} />
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
                    <div className="flex flex-col gap-2 w-full">
                        <span className="flex flex-col w-full">
                            <label className="pr-2" htmlFor="image">
                                Hình ảnh <span className="text-red-500">*</span>
                            </label>
                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="image"
                                className={`border-2 ${errors.serviceImage ? 'border-red-500' : 'border-gray-300'} h-[50px] rounded-md px-4 py-2`}
                            />
                            <ErrorMessage message={errors.serviceImage} />
                            <p className="text-gray-500 text-xs mt-1">Chấp nhận: JPG, PNG, WEBP (Tối đa 5MB)</p>
                        </span>
                    </div>
                )}

                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="duration">
                        Thời Lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="duration"
                        className={`border-2 ${errors.serviceDuration ? 'border-red-500' : 'border-gray-300'} h-[50px] rounded-md px-4 py-2`}
                        value={serviceDuration}
                        onChange={(e) => {
                            setServiceDuration(e.target.value);
                            if (!isNaN(Number(e.target.value)) && Number(e.target.value) > 0) {
                                setErrors(prev => ({...prev, serviceDuration: ""}));
                            }
                        }}
                    />
                    <ErrorMessage message={errors.serviceDuration} />
                </span>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="session">
                        Số Buổi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="session"
                        className={`border-2 ${errors.serviceSession ? 'border-red-500' : 'border-gray-300'} h-[50px] rounded-md px-4 py-2`}
                        value={serviceSession}
                        onChange={(e) => {
                            setServiceSession(e.target.value);
                            if (!isNaN(Number(e.target.value)) && Number(e.target.value) > 0) {
                                setErrors(prev => ({...prev, serviceSession: ""}));
                            }
                        }}
                    />
                    <ErrorMessage message={errors.serviceSession} />
                </span>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="price">
                        Giá <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="price"
                        className={`border-2 ${errors.servicePrice ? 'border-red-500' : 'border-gray-300'} h-[50px] rounded-md px-4 py-2`}
                        value={servicePrice}
                        onChange={(e) => {
                            setServicePrice(e.target.value);
                            if (!isNaN(Number(e.target.value)) && Number(e.target.value) > 0) {
                                setErrors(prev => ({...prev, servicePrice: ""}));
                            }
                        }}
                    />
                    <ErrorMessage message={errors.servicePrice} />
                </span>
                <span className="flex flex-col w-full">
                    <label className="pr-2" htmlFor="category">
                        Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            if (e.target.value !== "0") {
                                setErrors(prev => ({...prev, selectedCategory: ""}));
                            }
                        }}
                        className={`w-full p-2 border-2 ${errors.selectedCategory ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-[50px]`}
                    >
                        <option value="0">Chọn Danh Mục</option>
                        {categories.map((category) => (
                            <option key={category.id} id={category.id.toString()} value={category.id.toString()}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <ErrorMessage message={errors.selectedCategory} />
                </span>
            </div>
            <div className="mt-4">
                <label className="pr-2 block mb-2">
                    Mô tả <span className="text-red-500">*</span>
                </label>
                <TextEditor
                    ref={quillRef}
                    defaultValue={serviceDescriptionDefault}
                    onTextChange={(value) => {
                        setServiceDescription(value);
                        if (value && value.trim() !== '' && value !== '<p><br></p>') {
                            setErrors(prev => ({...prev, serviceDescription: ""}));
                        }
                    }}
                />
                <ErrorMessage message={errors.serviceDescription} />
            </div>
            {/* Notes for required fields */}
            <div className="mt-4 text-sm text-gray-500">
                <p><span className="text-red-500">*</span> Các trường bắt buộc</p>
            </div>
        </div>
    );
};

export default ServiceInfoForm;