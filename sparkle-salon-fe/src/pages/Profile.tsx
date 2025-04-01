import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { changePassword, getUser, updateUser } from "../data/authData";
import { toast } from "react-toastify";

export interface UserInfo {
    id: string;
    username: string;
    fullName: string;
    dob: string;
    email: string;
    phone: string;
}

export default function Profile() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validateErrors, setValidationErrors] = useState({});
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user) {
                setUserInfo(user);
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleChangePassword = async () => {

        if (!userInfo || !userInfo.id) {
            toast.error("❌ User ID is missing! Cannot update.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("password must contain 8 characters")
        } else {
            if (newPassword !== confirmPassword)
                toast.error("Confirm password and new password are not matched")
            else {
                const success = await changePassword(
                    userInfo.id,
                    oldPassword,
                    newPassword
                );
                setOldPassword("");
                setNewPassword("")
                setConfirmPassword("")
                if (!!success) {
                    setIsEditModalOpen(false);
                    toast.success("Cập nhật thành công!");
                }
            }
        };
    }
    const handleUpdate = async () => {
        if (!userInfo || !userInfo.id) {
            console.error("❌ User ID is missing! Cannot update.");
            return;
        }

        const success = await updateUser(
            userInfo.id,
            userInfo.fullName,
            userInfo.email,
            userInfo.phone,
            userInfo.dob
        );
        console.log("success", success);
        if (success) {
            toast.success("Cập nhật thành công!");
            setIsEditModalOpen(false);
        } else {
            toast.error("Lỗi khi cập nhật thông tin!");
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-gradient-to-br mt-24 px-4">

               
            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-white-100 bg-opacity-90 border-l-2 p-10 rounded-lg shadow-xl ml-6"
            >
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Trang Cá Nhân
                </h2>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Profile Header */}
                        <div className="relative mt-16 flex flex-col items-center text-center">
                            <h2 className="mt-4 text-3xl font-bold text-gray-800">
                                {userInfo?.username}
                            </h2>
                            <p className="text-gray-500 text-lg">
                                {userInfo?.fullName}
                            </p>
                            <p className="text-gray-500 text-lg">
                                {userInfo?.email}
                            </p>

                            {/* Edit Button */}
                            <div className="flex justify-around gap-4">

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition"
                                >
                                    Chỉnh Sửa
                                </button>
                                <button
                                    onClick={() => setIsChangePassword(true)}
                                    className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-blue-500 text-xl">
                                    Email:
                                </span>
                                <span className="text-lg">
                                    {userInfo?.email}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-green-500 text-xl">
                                    Sđt:
                                </span>
                                <span className="text-lg">
                                    {userInfo?.phone}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-blue-500 text-xl">
                                    Ngày Sinh:
                                </span>
                                <span className="text-lg">{userInfo?.dob}</span>
                            </div>
                        </div>
                    </motion.div>
            </motion.main>
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Cập Nhật Thông Tin
                        </h2>
                        <input
                            pattern="[a-zA-ZAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬEÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴaáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵĐđ ]+"
                            type="text"
                            name="fullName"
                            value={userInfo?.fullName || ""}
                            onChange={(e) => {
                                const validatedValue = e.target.value.replace(/[^a-zA-ZAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬEÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴaáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵĐđ ]/g, '');

                                const syntheticEvent = {
                                    ...e,
                                    target: {
                                        ...e.target,
                                        value: validatedValue,
                                        name: e.target.name
                                    }
                                };

                                handleInputChange(syntheticEvent);
                            }}
                            placeholder="Họ và Tên"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="date"
                            name="dob"
                            value={userInfo?.dob || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="mail"
                            name="email"
                            value={userInfo?.email || ""}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={userInfo?.phone || ""}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');

                                const truncatedValue = value.slice(0, 10);

                                const syntheticEvent = {
                                    ...e,
                                    target: {
                                        ...e.target,
                                        value: truncatedValue,
                                        name: e.target.name
                                    }
                                };

                                handleInputChange(syntheticEvent);
                            }
                            }
                            placeholder="Số điện thoại"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={(e) => {
                                    // Prevent default form submission
                                    e.preventDefault();

                                    // Validation checks
                                    let isValid = true;
                                    const errors = {};

                                    // Check if required fields are empty
                                    if (!userInfo?.fullName?.trim()) {
                                        isValid = false;
                                        errors.fullName = "Họ và tên không được để trống";
                                    }

                                    if (!userInfo?.email?.trim()) {
                                        isValid = false;
                                        errors.email = "Email không được để trống";
                                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email.trim())) {
                                        isValid = false;
                                        errors.email = "Email không hợp lệ";
                                    }

                                    // Check phone number validation
                                    if (!userInfo?.phone) {
                                        isValid = false;
                                        errors.phone = "Số điện thoại không được để trống";
                                    } else if (!/^\d{10}$/.test(userInfo.phone)) {
                                        isValid = false;
                                        errors.phone = "Số điện thoại phải có đúng 10 chữ số";
                                    }

                                    // Check other required fields as needed
                                    if (!userInfo?.dob) {
                                        isValid = false;
                                        errors.dob = "Ngày sinh không được để trống";
                                    }

                                    if (isValid) {
                                        handleUpdate();
                                    } else {
                                        setValidationErrors(errors);
                                        alert("Vui lòng kiểm tra lại thông tin!");
                                    }
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Lưu
                            </button>
                        </div>
                        {Object.keys(validateErrors).length > 0 && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            <h3 className="font-bold mb-2">Vui lòng sửa các lỗi sau:</h3>
                            <ul className="list-disc pl-5">
                                {Object.entries(validateErrors).map(([field, message]) => (
                                    <li key={field}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>
                    
                </div>
            )}
            {isChangePassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Đổi mật khẩu
                        </h2>
                        <input
                            type="password"
                            name="oldpassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Old password"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="password"
                            name="newpassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="password"
                            name="confirmpassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmpassword"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsChangePassword(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

