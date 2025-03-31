import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import {
  getAllTherapists,
  createTherapist,
  deleteTherapist,
  disableTherapist,
  enableTherapist,
  updateTherapistSv,
} from "../data/therapistData";
import { fetchServices } from "../components/quizApi";

export interface Therapist {
  id: string;
  username: string;
  fullName: string;
  email: string;
  experienceYears: number;
  bio: string;
  dob: string;
  phone: string;
  img: string;
  password: string;
  disabled: boolean;
  services: Service[];
}

export interface Service {
    id: number;
    name: string;
}

export default function TherapistManagement() {
    // State variables remain the same
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(
        null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    // Validation function
    const validateForm = (formData: FormData): boolean => {
        const newErrors: Record<string, string> = {};

        // For new therapists, validate required fields
        if (!editingTherapist) {
            // Username validation
            const username = formData.get("username") as string;
            if (!username || username.trim() === "") {
                newErrors.username = "Tên người dùng không được để trống";
            } else if (username.length < 3) {
                newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
            }

            // Password validation
            const password = formData.get("pass") as string;
            if (!password || password.trim() === "") {
                newErrors.password = "Mật khẩu không được để trống";
            } else if (password.length < 6) {
                newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setIsLoading(true);

      const experienceYears = parseInt(
        (formData.get("experienceYears") as string) || "0"
      );
      const bio = (formData.get("bio") as string) || "";
      const serviceIds = selectedServices.map((s) => s.id);
      
      console.log("Dữ liệu trước khi gửi:", {
        serviceIds,
        img: selectedFile ? selectedFile.name : "default.jpg",
        therapistId: editingTherapist?.id,
      });

      if (editingTherapist) {
        const success = await updateTherapistSv(
          editingTherapist.id,
          selectedFile || new File([], "default.jpg"),
          serviceIds
        );

        console.log("success: ", success);
        setSuccessMessage("Cập nhật thông tin chuyên viên thành công");

        // if (!success) {
        //   throw new Error("Cập nhật thất bại - Kiểm tra phản hồi từ server");
        // }
      } else {
        const newTherapist = {
          username: (formData.get("username") as string) || "",
          fullName: (formData.get("fullName") as string) || "",
          email: (formData.get("email") as string) || "",
          password: (formData.get("pass") as string) || "",
          phone: (formData.get("phone") as string) || "",
          experienceYears,
          bio,
          dob: (formData.get("dob") as string) || "",
          serviceIds, // Truyền serviceIds trực tiếp
          img: selectedFile || new File([], "default.jpg"), // Gửi File
        };

        if (!newTherapist.username || !newTherapist.email) {
          throw new Error(
            "Thiếu các trường bắt buộc (tên người dùng hoặc email)"
          );
        }

        const success = await createTherapist(newTherapist);
        // if (!success) {
        //   throw new Error("Tạo mới thất bại - Kiểm tra phản hồi từ server");
        // }
        if (success) {
          console.log(success);
          setSuccessMessage("Thêm chuyên viên mới thành công");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Đã xảy ra lỗi khi lưu thông tin chuyên viên";
      console.error("Lỗi chi tiết khi lưu thông tin chuyên viên:", error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      closeModal();
      await fetchTherapists();
      await fetchServices(); // Load lại danh sách
    }
  };

  const handleToggleStatus = async (therapist: Therapist) => {
    const isDisabling = !therapist.disabled;
    const confirmMessage = isDisabling
      ? "Bạn có chắc chắn muốn vô hiệu hóa chuyên viên này?"
      : "Bạn có chắc chắn muốn kích hoạt lại chuyên viên này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const success = isDisabling
        ? await disableTherapist(therapist.id)
        : await enableTherapist(therapist.id);

      if (success) {
        setTherapists((prev) =>
          prev.map((t) =>
            t.id === therapist.id ? { ...t, disabled: isDisabling } : t
          )
        );
        if (isNaN(experienceYears) || experienceYears < 0) {
            newErrors.experienceYears = "Số năm kinh nghiệm phải là số dương";
        }

        // Bio validation (required for both new and editing)
        const bio = formData.get("bio") as string;
        if (!bio || bio.trim() === "") {
            newErrors.bio = "Tiểu sử không được để trống";
        } else if (bio.length > 10) {
            newErrors.bio = "Tiểu sử phải có ít nhất 10 ký tự";
        }

        // Services validation
        if (selectedServices.length === 0) {
            newErrors.services = "Phải chọn ít nhất một dịch vụ";
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fetch therapists data
    const fetchTherapists = async () => {
        setIsLoading(true);
        try {
            const therapistsData = await getAllTherapists();
            console.log("API Response:", therapistsData);
            setTherapists(therapistsData);
            setError(null);
        } catch (error) {
            console.error("Error fetching therapists:", error);
            setError(
                "Không thể tải danh sách chuyên viên. Vui lòng thử lại sau."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch services data
    const fetchServicesData = async () => {
        try {
            const servicesData = await fetchServices(0, 100);
            console.log("Dịch vụ sau khi fetch:", servicesData);
            setServices(servicesData);
            setFilteredServices(servicesData);
        } catch (err) {
            console.error("Lỗi khi lấy dịch vụ:", err);
            setServices([]);
            setFilteredServices([]);
        }
    };

    useEffect(() => {
        fetchTherapists();
        fetchServicesData();
    }, []);

    useEffect(() => {
        const filtered = services.filter((service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(filtered);
    }, [searchTerm, services]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const openModal = (therapist: Therapist | null = null) => {
        setEditingTherapist(therapist ? { ...therapist } : null);
        setSelectedFile(null);
        setSearchTerm("");
        setSelectedServices(therapist ? therapist.services : []);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTherapist(null);
        setSelectedFile(null);
        setSearchTerm("");
        setSelectedServices([]);
        setValidationErrors({});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleServiceToggle = (service: Service) => {
        setSelectedServices((prev) =>
            prev.some((s) => s.id === service.id)
                ? prev.filter((s) => s.id !== service.id)
                : [...prev, service]
        );
    };

    // Form submission handler remains the same
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Validate form before submitting
        if (!validateForm(formData)) {
            // Return early if validation fails
            return;
        }

        try {
            setIsLoading(true);

            const experienceYears = parseInt(
                (formData.get("experienceYears") as string) || "0"
            );
            const bio = (formData.get("bio") as string) || "";
            const serviceIds = selectedServices.map((s) => s.id);

            console.log("Dữ liệu trước khi gửi:", {
                experienceYears,
                bio,
                serviceIds,
                img: selectedFile ? selectedFile.name : "default.jpg",
                therapistId: editingTherapist?.id,
            });

            if (editingTherapist) {
                const success = await updateTherapist(
                    editingTherapist.id,
                    experienceYears,
                    bio,
                    selectedFile || new File([], "default.jpg"),
                    serviceIds
                );

                console.log("success: ", success);
                setSuccessMessage("Cập nhật thông tin chuyên viên thành công");
            } else {
                const newTherapist = {
                    username: (formData.get("username") as string) || "",
                    fullName: (formData.get("fullName") as string) || "",
                    email: (formData.get("email") as string) || "",
                    password: (formData.get("pass") as string) || "",
                    phone: (formData.get("phone") as string) || "",
                    experienceYears,
                    bio,
                    dob: (formData.get("dob") as string) || "",
                    serviceIds,
                    img: selectedFile || new File([], "default.jpg"),
                };

                const success = await createTherapist(newTherapist);
                if (success) {
                    console.log(success);
                    setSuccessMessage("Thêm chuyên viên mới thành công");
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? `Lỗi: ${error.message}`
                    : "Đã xảy ra lỗi khi lưu thông tin chuyên viên";
            console.error("Lỗi chi tiết khi lưu thông tin chuyên viên:", error);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            // Only close modal if no validation errors
            if (Object.keys(validationErrors).length === 0) {
                closeModal();
                await fetchTherapists();
                await fetchServices();
            }
        }
    };

                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Số Điện Thoại</th>
                    <th className="p-3 text-left">bio</th>
                    <th className="p-3 text-left">Kinh Nghiệm (năm)</th>
                    <th className="p-6 text-left">Dịch vụ</th>
                    <th className="p-3 text-left">Trạng Thái</th>
                    <th className="p-3 text-left">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {therapists.length > 0 ? (
                    therapists.map((therapist) => (
                      <tr key={therapist.id} className="border-t">
                        <td className="p-3">{therapist.fullName}</td>
                        <td className="p-3">
                          {" "}
                          <img
                            src={therapist.img}
                            alt="Therapist"
                            className="mt-8 h-60 object-cover rounded"
                          />
                        </td>

        if (!window.confirm(confirmMessage)) return;

        try {
            const success = isDisabling
                ? await disableTherapist(therapist.id)
                : await enableTherapist(therapist.id);

      <ManagementModal
        isOpen={isModalOpen}
        title={editingTherapist ? "Chỉnh Sửa chuyên viên" : "Thêm chuyên viên"}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        <div
          className={
            editingTherapist
              ? "space-y-3"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          }
        >
          {/* Left Column - Chỉ hiển thị khi thêm mới */}
          {!editingTherapist && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người dùng *
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Tên người dùng"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  name="pass"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingTherapist?.phone || ""}
                  placeholder="Số điện thoại"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  name="dob"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  name="img"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  accept="image/*"
                />
                {editingTherapist?.img && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Ảnh hiện tại: {editingTherapist.img.split("/").pop()}
                    </p>
                    <img
                      src={editingTherapist.img}
                      alt="Therapist"
                      className="mt-8 h-60 object-cover rounded"
                    />
                  </div>
                )}
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Đã chọn: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Right Column - Chỉ hiển thị Số năm kinh nghiệm và Tiểu sử khi thêm mới */}
          <div className="space-y-3">
            {!editingTherapist && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số năm kinh nghiệm *
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    defaultValue={editingTherapist?.experienceYears || ""}
                    placeholder="Số năm"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiểu sử *
                  </label>
                  <textarea
                    name="bio"
                    defaultValue={editingTherapist?.bio || ""}
                    placeholder="Tiểu sử"
                    className="w-full p-2 border rounded h-24"
                    required
                  />
                </div>
              </>
            )}

            {/* Phần Dịch vụ luôn hiển thị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dịch vụ *
              </label>
              <div className="space-y-2">
                <div className="max-h-24 overflow-y-auto border rounded p-2">
                  {selectedServices.length > 0 ? (
                    selectedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="truncate">{service.name}</span>
                        <button
                          onClick={() => handleServiceToggle(service)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Chưa có dịch vụ</p>
                  )}
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Tìm dịch vụ..."
                />
                {filteredServices.length > 0 && (
                  <div className="max-h-24 overflow-y-auto border rounded p-2">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceToggle(service)}
                        className={`py-1 cursor-pointer hover:bg-gray-100 truncate ${
                          selectedServices.some((s) => s.id === service.id)
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-black"
                        }`}
                      >
                        {service.name}
                      </div>
                    ))}
                  </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                <div className="bg-pink-100 shadow-lg rounded-lg p-4 md:p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách chuyên viên
                    </h2>
                    {isLoading ? (
                        <div className="text-center py-4">Đang tải...</div>
                    ) : (
                        <div className="overflow-auto max-h-screen pb-6">
                            <div className="min-w-full inline-block align-middle">
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-white sticky top-0 z-10">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Họ Tên
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Hình ảnh
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Email
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    SĐT
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Bio
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    KN
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Dịch vụ
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Trạng Thái
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                                                >
                                                    Hành Động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {therapists.length > 0 ? (
                                                therapists.map((therapist) => (
                                                    <tr
                                                        key={therapist.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">
                                                            {therapist.fullName}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            <img
                                                                src={
                                                                    therapist.img
                                                                }
                                                                alt="Therapist"
                                                                className="h-16 w-16 object-cover rounded-md shadow"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                                                            {therapist.email}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {therapist.phone}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            <div className="max-h-20 overflow-y-auto max-w-xs">
                                                                <p className="line-clamp-3 hover:line-clamp-none cursor-pointer">
                                                                    {
                                                                        therapist.bio
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                                            {
                                                                therapist.experienceYears
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            <div className="max-h-20 overflow-y-auto max-w-sm">
                                                                {therapist
                                                                    ?.services
                                                                    ?.length >
                                                                0 ? (
                                                                    <ul className="list-disc list-inside">
                                                                        {therapist.services.map(
                                                                            (
                                                                                service
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        service.id
                                                                                    }
                                                                                    className="truncate hover:text-clip"
                                                                                >
                                                                                    {
                                                                                        service.name
                                                                                    }
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-500 italic text-center">
                                                                        Không có
                                                                        dịch vụ
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    therapist.disabled
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {therapist.disabled
                                                                    ? "Vô hiệu hóa"
                                                                    : "Hoạt động"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            <div className="flex flex-col space-y-2">
                                                                <button
                                                                    onClick={() =>
                                                                        openModal(
                                                                            therapist
                                                                        )
                                                                    }
                                                                    className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                                                                >
                                                                    Chỉnh Sửa
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleStatus(
                                                                            therapist
                                                                        )
                                                                    }
                                                                    className={`${
                                                                        therapist.disabled
                                                                            ? "bg-green-500 hover:bg-green-600"
                                                                            : "bg-yellow-500 hover:bg-yellow-600"
                                                                    } text-white px-2 py-1 text-xs rounded transition-colors flex items-center justify-center`}
                                                                >
                                                                    {therapist.disabled
                                                                        ? "Kích Hoạt"
                                                                        : "Vô Hiệu Hóa"}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            therapist.id
                                                                        )
                                                                    }
                                                                    className={`bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition-colors flex items-center justify-center ${
                                                                        !therapist.disabled
                                                                            ? "opacity-50 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                    disabled={
                                                                        !therapist.disabled
                                                                    }
                                                                    title={
                                                                        !therapist.disabled
                                                                            ? "Vui lòng vô hiệu hóa trước khi xóa"
                                                                            : "Xóa chuyên viên"
                                                                    }
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={9}
                                                        className="px-4 py-3 text-sm text-center text-gray-500"
                                                    >
                                                        Không có chuyên viên nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ManagementModal
                isOpen={isModalOpen}
                title={
                    editingTherapist
                        ? "Chỉnh Sửa chuyên viên"
                        : "Thêm chuyên viên"
                }
                onClose={closeModal}
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                        {!editingTherapist && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên người dùng *
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Tên người dùng"
                                        className={`w-full p-2 border rounded ${
                                            validationErrors.username
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {validationErrors.username && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.username}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password *
                                    </label>
                                    <input
                                        type="text"
                                        name="pass"
                                        placeholder="Password"
                                        className={`w-full p-2 border rounded ${
                                            validationErrors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {validationErrors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Họ và tên"
                                        className={`w-full p-2 border rounded ${
                                            validationErrors.fullName
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {validationErrors.fullName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.fullName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className={`w-full p-2 border rounded ${
                                            validationErrors.email
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {validationErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={
                                            editingTherapist?.phone || ""
                                        }
                                        placeholder="Số điện thoại"
                                        className={`w-full p-2 border rounded ${
                                            validationErrors.phone
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {validationErrors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.phone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ngày sinh *
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        className={`w-full p-2 border rounded ${
                                            validationErrors.dob
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    />
                                    {validationErrors.dob && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.dob}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số năm kinh nghiệm *
                            </label>
                            <input
                                type="number"
                                name="experienceYears"
                                defaultValue={
                                    editingTherapist?.experienceYears || ""
                                }
                                placeholder="Số năm"
                                className={`w-full p-2 border rounded ${
                                    validationErrors.experienceYears
                                        ? "border-red-500"
                                        : ""
                                }`}
                                required
                            />
                            {validationErrors.experienceYears && (
                                <p className="text-red-500 text-xs mt-1">
                                    {validationErrors.experienceYears}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh
                            </label>
                            <input
                                type="file"
                                name="img"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded"
                                accept="image/*"
                            />
                            {editingTherapist?.img && !selectedFile && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Ảnh hiện tại:{" "}
                                        {editingTherapist.img.split("/").pop()}
                                    </p>
                                    <img
                                        src={editingTherapist.img}
                                        alt="Therapist"
                                        className="mt-4 h-40 object-cover rounded"
                                    />
                                </div>
                            )}
                            {selectedFile && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Đã chọn: {selectedFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dịch vụ *
                            </label>
                            <div
                                className={`space-y-2 ${
                                    validationErrors.services
                                        ? "border-red-500"
                                        : ""
                                }`}
                            >
                                <div className="max-h-24 overflow-y-auto border rounded p-2">
                                    {selectedServices.length > 0 ? (
                                        selectedServices.map((service) => (
                                            <div
                                                key={service.id}
                                                className="flex items-center justify-between py-1"
                                            >
                                                <span className="truncate">
                                                    {service.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleServiceToggle(
                                                            service
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Chưa có dịch vụ
                                        </p>
                                    )}
                                </div>
                                {validationErrors.services && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {validationErrors.services}
                                    </p>
                                )}
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full p-2 border rounded"
                                    placeholder="Tìm dịch vụ..."
                                />
                                {filteredServices.length > 0 && (
                                    <div className="max-h-24 overflow-y-auto border rounded p-2">
                                        {filteredServices.map((service) => (
                                            <div
                                                key={service.id}
                                                onClick={() =>
                                                    handleServiceToggle(service)
                                                }
                                                className={`py-1 cursor-pointer hover:bg-gray-100 truncate ${
                                                    selectedServices.some(
                                                        (s) =>
                                                            s.id === service.id
                                                    )
                                                        ? "text-gray-400 cursor-not-allowed"
                                                        : "text-black"
                                                }`}
                                            >
                                                {service.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ManagementModal>
        </div>
    );
}
