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
        setSuccessMessage(
          isDisabling
            ? "Đã vô hiệu hóa chuyên viên thành công"
            : "Đã kích hoạt chuyên viên thành công"
        );
        setError(null);
      } else {
        throw new Error(
          isDisabling
            ? "Không thể vô hiệu hóa chuyên viên"
            : "Không thể kích hoạt chuyên viên"
        );
      }
    } catch (error) {
      console.error("Error toggling therapist status:", error);
      setError(
        isDisabling
          ? "Đã xảy ra lỗi khi vô hiệu hóa chuyên viên"
          : "Đã xảy ra lỗi khi kích hoạt chuyên viên"
      );
    }
  };

  const handleDelete = async (id: string) => {
    const therapist = therapists.find((t) => t.id === id);
    if (!therapist) {
      setError("Không tìm thấy thông tin chuyên viên");
      return;
    }

    if (!therapist.disabled) {
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

                        <td className="p-3">{therapist.email}</td>
                        <td className="p-3">{therapist.phone}</td>
                        <td className="p-3">{therapist.bio}</td>

                        <td className="p-3">{therapist.experienceYears}</td>
                        <td className="p-3">
                          {therapist?.services?.length > 0 ? (
                            <ul className="list-disc list-inside max-h-24 overflow-y-auto">
                              {therapist.services.map((service) => (
                                <li
                                  key={service.id}
                                  className="truncate text-ellipsis overflow-hidden"
                                >
                                  {service.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-center italic">
                              Không có dịch vụ
                            </p>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded ${
                              therapist.disabled
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {therapist.disabled ? "Vô hiệu hóa" : "Hoạt động"}
                          </span>
                        </td>
                        <td className="p-3 flex space-x-2">
                          <button
                            onClick={() => openModal(therapist)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Chỉnh Sửa
                          </button>
                          <button
                            onClick={() => handleToggleStatus(therapist)}
                            className={`${
                              therapist.disabled
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                            } text-white px-3 py-1 rounded`}
                          >
                            {therapist.disabled ? "Kích Hoạt" : "Vô Hiệu Hóa"}
                          </button>
                          <button
                            onClick={() => handleDelete(therapist.id)}
                            className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ${
                              !therapist.disabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={!therapist.disabled}
                            title={
                              !therapist.disabled
                                ? "Vui lòng vô hiệu hóa trước khi xóa"
                                : "Xóa chuyên viên"
                            }
                          >
                            Xóa
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
              </div>
            </div>
          </div>
        </div>
      </ManagementModal>
    </div>
  );
}
