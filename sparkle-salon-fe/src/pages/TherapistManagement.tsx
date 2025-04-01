import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion, AnimatePresence } from "framer-motion";

import {
  getAllTherapists,
  createTherapist,
  deleteTherapist,
  disableTherapist,
  enableTherapist,
  updateTherapistSv,
} from "../data/therapistData";
import { fetchServices } from "../components/quizApi";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

export interface Therapist {
  id: string;
  username: string;
  fullName: string;
  email: string;
  experienceYears: number;
  bio: string;
  dob: string;
  userId: string;

  phone: string;
  img: string;
  password: string;
  active: boolean;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
}

export default function TherapistManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(
    null
  );
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");

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
      setError("Không thể tải danh sách chuyên viên. Vui lòng thử lại sau.");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
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

          serviceIds
        );

        if (success) {
          toast.success("Cập nhật dịch vụ thành công");
          closeModal();
        }
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
          toast.success("Cập nhật câu hỏi thành công");
          closeModal();
        }
      }

      setIsLoading(false);
      fetchTherapists();
      fetchServices();
    } catch (error) {
      toast.error(error instanceof Error);
    } //finally {
    // setIsLoading(false);
    // closeModal();
    // await fetchTherapists();
    // await fetchServices(); // Load lại danh sách
    // }
  };

  const handleToggleStatus = async (therapist: Therapist) => {
    const isDisabling = !therapist.active;
    const confirmMessage = isDisabling
      ? "Bạn có chắc chắn muốn kích hoạt lại chuyên viên này?"
      : "Bạn có chắc chắn muốn vô hiệu hóa chuyên viên này?";

    if (!window.confirm(confirmMessage)) return;

    const success = isDisabling
      ? await enableTherapist(therapist.userId)
      : await disableTherapist(therapist.userId);

    if (success) {
      toast.success("");
    }
    if (!therapist.active) {
      toast.success("Đã kích hoạt thành công");
    } else {
      toast.success("Đã vô hiệu hóa thành công");
    }
    fetchTherapists();
    setIsLoading(false);
  };

  const handleViewTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTherapist(null);
  };

  const handleDelete = async (id: string) => {
    const therapist = therapists.find((t) => t.id === id);
    if (!therapist) {
      setError("Không tìm thấy thông tin chuyên viên");
      return;
    }

    if (!therapist.active) {
      setError(
        "Không thể xóa chuyên viên đang hoạt động. Vui lòng vô hiệu hóa trước."
      );
      return;
    }

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa chuyên viên này? Hành động này không thể hoàn tác."
      )
    )
      return;

    try {
      setIsLoading(true);
      const success = await deleteTherapist(id);
      if (success) {
        setTherapists((prev) => prev.filter((t) => t.id !== id));
        setSuccessMessage("Đã xóa chuyên viên thành công");
        setError(null);
      } else {
        throw new Error("Không thể xóa chuyên viên");
      }
    } catch (error) {
      console.error("Error deleting therapist:", error);
      setError("Đã xảy ra lỗi khi xóa chuyên viên");
    } finally {
      setIsLoading(false);
    }
  };
  const filteredTherapists = therapists.filter(
    (therapist) =>
      (
        (therapist.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (therapist.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (therapist.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      ) &&
      (selectedCategory === "Tất Cả" ||
        therapist.services.some((service) => service.name === selectedCategory))
  );

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý chuyên viên
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
          >
            + Thêm chuyên viên
          </button>
        </div>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow">
          <div className="w-full md:w-2/4 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="w-full md:w-2/4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="Tất Cả">Tất Cả</option>
              {[...new Set(services.map((s) => s.name))].map((serviceName) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="bg-pink-100 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh Sách chuyên viên</h2>
          {isLoading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="overflow-y-auto max-h-[900px] scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead className="sticky top-0 bg-white shadow-md">
                  <tr className="bg-white text-black">
                    <th className="p-3 text-left">Họ Tên</th>
                    <th className="p-3 text-left">Hình ảnh</th>

                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Số Điện Thoại</th>
                    {/* <th className="p-3 text-left">bio</th> */}
                    <th className="p-3 text-left">Kinh Nghiệm (năm)</th>
                    {/* <th className="p-6 text-left">Dịch vụ</th> */}
                    <th className="p-3 text-left">Trạng Thái</th>
                    <th className="p-3 text-left">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredTherapists.length > 0 ? (
                    filteredTherapists.map((therapist, index) => (
                      <tr key={index}>
                        <td className="p-3">{therapist.fullName}</td>
                        <td className="p-4">
                          <img
                            src={therapist.img}
                            alt="Therapist"
                            className="h-16 w-16 object-cover rounded-full"
                          />
                        </td>
                        <td className="p-3">{therapist.email}</td>
                        <td className="p-3">{therapist.phone}</td>
                        <td className="p-3">{therapist.experienceYears} năm</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded ${
                              therapist.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {therapist.active ? "Hoạt động" : "Vô hiệu hóa"}
                          </span>
                        </td>
                        <td className="p-3 flex space-x-2">
                          <button
                            onClick={() => handleViewTherapist(therapist)}
                            className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 flex items-center gap-1"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openModal(therapist)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                          >
                            Chỉnh Sửa
                          </button>
                          <button
                            onClick={() => handleToggleStatus(therapist)}
                            className={`${
                              therapist.active
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                            } text-white px-3 py-1 rounded-lg flex items-center gap-1`}
                          >
                            {therapist.active ? "Vô Hiệu Hóa" : "Kích Hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-3 text-center">
                        Không có chuyên viên nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

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
                  type="password"
                  name="pass"
                  placeholder="Password (tối thiểu 8 ký tự)"
                  className="w-full p-2 border rounded"
                  required
                  minLength={8}
                  onInvalid={(e) =>
                    e.currentTarget.setCustomValidity(
                      "Mật khẩu phải có ít nhất 8 ký tự"
                    )
                  }
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
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
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingTherapist?.phone || ""}
                  placeholder="Số điện thoại (bắt đầu bằng 0, 10 số)"
                  className="w-full p-2 border rounded"
                  required
                  pattern="0[0-9]{9}"
                  maxLength={10}
                  onInvalid={(e) =>
                    e.currentTarget.setCustomValidity(
                      "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 số"
                    )
                  }
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
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
            </div>
          )}

          {/* Right Column */}
          <div className="space-y-3">
            {!editingTherapist && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiểu sử *
                </label>
                <textarea
                  name="bio"
                  defaultValue={editingTherapist?.bio || ""}
                  placeholder="Tiểu sử"
                  className="w-full p-2 border rounded h-20"
                  required
                />
              </div>
            )}
            {/* Phần Dịch vụ luôn hiển thị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dịch vụ *
              </label>
              <div className="space-y-2">
                <div className="max-h-20 overflow-y-auto border rounded p-2">
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
              </div>
            </div>

            {!editingTherapist && (
              <>
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
                    <div className="mt-2">
                      <p className="mt-2 text-sm text-gray-500">
                        Đã chọn: {selectedFile.name}
                      </p>
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="mt-2 h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </ManagementModal>
      {/* Modal xem chi tiết chuyên viên */}
      <AnimatePresence>
        {isViewModalOpen && selectedTherapist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeViewModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Thông tin Chuyên viên</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Đóng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[70vh] pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTherapist.img && (
                    <div className="md:col-span-2">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <img
                          src={selectedTherapist.img}
                          alt={selectedTherapist.fullName}
                          className="w-[300px] h-[315px] object-cover rounded mx-auto" // Đồng bộ kích thước với carousel
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium text-lg">
                      {selectedTherapist.fullName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Kinh nghiệm</p>
                    <p className="font-medium">
                      {selectedTherapist.experienceYears} năm
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedTherapist.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedTherapist.phone}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Tiểu sử</p>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-700">
                      {selectedTherapist.bio || "Không có tiểu sử"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Dịch vụ</p>
                  {selectedTherapist.services?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTherapist.services.map((service) => (
                        <span
                          key={service.id}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Không có dịch vụ</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-center gap-3">
                <motion.button
                  onClick={closeViewModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
