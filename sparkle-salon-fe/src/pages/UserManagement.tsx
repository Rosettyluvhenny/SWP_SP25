import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { getAllUser, createUser, deleteUser } from "../data/authData";
import { toast } from "react-toastify";
import { disableTherapist, enableTherapist } from "../data/therapistData";
import { FaSearch } from "react-icons/fa";
import { User } from "lucide-react";

type Role = {
  name: string;
  description: string;
};

type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  active: boolean;
  password?: string;
  roles?: Role[];
};

interface ValidationErrors {
  username?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  password?: string;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Tất Cả");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, [submitting]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUser();
      if (userData) {
        setUsers(userData);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user: User | null = null) => {
    setEditingUser(
      user ?? {
        id: "",
        username: "",
        email: "",
        fullName: "",
        phone: "",
        dob: "",
        active: true,
      }
    );
    // Reset errors when opening modal
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!editingUser) return false;

    // Username validation
    if (!editingUser.username || editingUser.username.trim() === "") {
      newErrors.username = "Tên người dùng không được để trống";
      isValid = false;
    } else if (editingUser.username.length < 5) {
      newErrors.username = "Tên người dùng phải có ít nhất 5 ký tự";
      isValid = false;
    }

    // Full name validation
    if (!editingUser.fullName || editingUser.fullName.trim() === "") {
      newErrors.fullName = "Họ tên không được để trống";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editingUser.email || editingUser.email.trim() === "") {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!emailRegex.test(editingUser.email)) {
      newErrors.email = "Định dạng email không hợp lệ";
      isValid = false;
    }

    // Phone validation - Vietnamese format
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!editingUser.phone || editingUser.phone.trim() === "") {
      newErrors.phone = "Số điện thoại không được để trống";
      isValid = false;
    } else if (!phoneRegex.test(editingUser.phone)) {
      newErrors.phone =
        "Số điện thoại không hợp lệ (phải theo định dạng Việt Nam +84 hoặc 0)";
      isValid = false;
    }

    // Password validation for new users
    if (!isEditingExistingUser()) {
      if (!editingUser.password || editingUser.password.trim() === "") {
        newErrors.password = "Mật khẩu không được để trống";
        isValid = false;
      } else if (editingUser.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        isValid = false;
      } else if (editingUser.password.length > 20) {
        newErrors.password = "Mật khẩu không được quá 20 ký tự";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      if (editingUser.id && users.some((u) => u.id === editingUser.id)) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? editingUser : u))
        );
      } else {
        const success = await createUser(isStaff,{
          username: editingUser.username,
          password: editingUser.password || "defaultPassword",
          fullName: editingUser.fullName,
          email: editingUser.email,
          phone: editingUser.phone,
          dob: editingUser.dob,
        });
          await fetchUsers();
          toast.success("Tạo người dùng thành công");
      }
      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error("Lỗi khi lưu thông tin người dùng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable = async (user: User) => {
    const isDisabling = !user.active;
    console.log(user.id);
    const confirmMessage = isDisabling
      ? "Bạn có chắc chắn muốn kích hoạt lại chuyên viên này?"
      : "Bạn có chắc chắn muốn vô hiệu hóa chuyên viên này?";

    if (!window.confirm(confirmMessage)) return;

    const success = isDisabling
      ? await enableTherapist(user.id)
      : await disableTherapist(user.id);

      console.log(success);
    if (success) {
      toast.success("Thay đổi trạng thái người dùng thành công!");
    } else {
      toast.error("Không thể vô hiệu hóa người dùng!");
    }
    fetchUsers();
    setLoading(false);
  };

  const handleDelete = async (userId: string | number) => {
    const user = users.find((u) => u.id === userId);
    const isDisabled = user?.roles?.some((role) => role.name === "DISABLED");

    if (!isDisabled) {
      toast.error("Bạn phải vô hiệu hóa người dùng trước khi xóa!");
      return;
    }

    if (userId === undefined || userId === null) {
      console.error("Invalid user ID:", userId);
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
    );

    if (confirmDelete) {
      try {
        const success = await deleteUser(userId.toString());

        if (success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
          toast.success("Xóa người dùng thành công!");
        } else {
          toast.error("Không thể xóa người dùng!");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Lỗi khi xóa người dùng!");
      }
    }
  };

  const isEditingExistingUser = () => {
    return editingUser ? users.some((u) => u.id === editingUser.id) : false;
  };

  const isUserDisabled = (user: User) => {
    return user.roles?.some((role) => role.name === "DISABLED");
  };

  const filteredUsers = users.filter((user) =>
    (
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) && 
    (
      selectedRole === "Tất Cả" || 
      user.roles?.some((role) => role.name === selectedRole)
    )
  );

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý Người Dùng
          </h1>
          <div className="flex gap-4">
          <button
            onClick={() => {setIsStaff(false);openModal(null)}}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
            >
            + Thêm Người Dùng
          </button>
          <button
            onClick={() =>{setIsStaff(true); openModal(null)}}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
            >
            + Thêm Nhân Viên
          </button>
          </div>
        </div>

        {/* Search Bar */}
       
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow">
          <div className="w-full md:w-3/4 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="w-full md:w-1/4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="Tất Cả">Tất Cả</option>
              {[
                ...new Set(
                  users.flatMap(
                    (user) => user.roles?.map((role) => role.name) || []
                  )
                ),
              ].map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* User Table */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh Sách Người Dùng</h2>

          {loading ? (
            <div className="text-center py-4">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead className="sticky top-0 bg-white shadow-md">
                  <tr className="text-black">
                    <th className="p-3 text-left">Tên Người Dùng</th>
                    <th className="p-3 text-left">Họ Tên</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Số Điện Thoại</th>
                    <th className="p-3 text-left">Ngày Sinh</th>
                    <th className="p-3 text-left">Vai Trò</th>
                    <th className="p-3 text-left">Trạng Thái</th>

                    <th className="p-3 text-left">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.fullName}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3">{user.dob}</td>
                      <td className="p-3">
                        {user.roles?.map((role) => role.name).join(", ") ||
                          "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded ${
                            user.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.active ? "Hoạt động" : "Vô hiệu hóa"}
                        </span>
                      </td>
                      <td className="p-3 flex space-x-2">
                        {!isUserDisabled(user) ? (
                          <button
                            onClick={() => handleDisable(user)}
                            className={`${
                              user.active
                                ? "bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                                : "bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 flex items-center gap-1"
                            } text-white px-3 py-1 rounded`}
                          >
                            {user.active ? "Vô Hiệu Hóa" : "Kích Hoạt"}
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                            >
                              Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ManagementModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSave}
          title={
            isEditingExistingUser() ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng"
          }
        >
          <div className="flex flex-col space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            <label className="font-semibold">
              Tên Người Dùng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingUser?.username || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, username: e.target.value } : null
                )
              }
              className={`p-2 border rounded ${
                errors.username ? "border-red-500" : ""
              }`}
              disabled={isEditingExistingUser()}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}

            <label className="font-semibold">
              Họ Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={editingUser?.fullName || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, fullName: e.target.value } : null
                )
              }
              className={`w-full p-2 border rounded ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}

            <label className="font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editingUser?.email || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, email: e.target.value } : null
                )
              }
              className={`p-2 border rounded ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <label className="font-semibold">
              Ngày Sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={editingUser?.dob || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, dob: e.target.value } : null
                )
              }
              className={`p-2 border rounded ${
                errors.dob ? "border-red-500" : ""
              }`}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

            <label className="font-semibold">
              Số Điện Thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingUser?.phone || ""}
              onChange={(e) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, phone: e.target.value } : null
                )
              }
              className={`p-2 border rounded ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}

            {!isEditingExistingUser() && (
              <>
                <label className="font-semibold">
                  Mật Khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  onChange={(e) =>
                    setEditingUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            password: e.target.value,
                          }
                        : null
                    )
                  }
                  className={`p-2 border rounded ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Nhập mật khẩu cho người dùng mới"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </>
            )}
          </div>
        </ManagementModal>
      </main>
    </div>
  );
}
