import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { createPayment, getPayment, updatePayment, activePayment, deactivePayment } from "../data/paymentData";
import { toast } from "react-toastify";

type PaymentMethod = {
    paymentId: string;
    paymentName: string;
    status?: boolean; 
};

export default function PaymentManagement() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const payments = await getPayment();
                console.log("API Response:", payments); 
                setPaymentMethods(payments);
                setError(null);
            } catch (error) {
                console.error("Error fetching payment methods:", error);
                setError("Không thể tải phương thức thanh toán. Vui lòng thử lại sau.");
                toast.error("Không thể tải phương thức thanh toán");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPayments();
    }, []);

    const openModal = (method: PaymentMethod | null = null) => {
        setEditingMethod(method);
        setNameInput(method?.paymentName || "");
        setNameError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMethod(null);
        setNameInput("");
        setNameError(null);
    };

    const validatePaymentName = (name: string): boolean => {
        // Trim the name to check if it's empty after trimming
        const trimmedName = name.trim();
        
        if (!trimmedName) {
            setNameError("Tên phương thức không được để trống");
            return false;
        }
        
        if (trimmedName.length < 2) {
            setNameError("Tên phương thức phải có ít nhất 2 ký tự");
            return false;
        }
        
        if (trimmedName.length > 50) {
            setNameError("Tên phương thức không được vượt quá 50 ký tự");
            return false;
        }
        
        // Check if name already exists (except for the current method being edited)
        const nameExists = paymentMethods.some(
            method => method.paymentName.toLowerCase() === trimmedName.toLowerCase() && 
                     (!editingMethod || method.paymentId !== editingMethod.paymentId)
        );
        
        if (nameExists) {
            setNameError("Phương thức thanh toán này đã tồn tại");
            return false;
        }
        
        setNameError(null);
        return true;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNameInput(value);
        
        // Optional: validate in real-time
        if (value) {
            validatePaymentName(value);
        } else {
            setNameError(null); // Clear error when input is empty
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final validation before submission
        if (!validatePaymentName(nameInput)) {
            return; // Stop submission if validation fails
        }
        
        try {
            if (editingMethod) {
                const success = await updatePayment(editingMethod.paymentId, nameInput.trim());
                if (success) {
                    setPaymentMethods((prev) => 
                        prev.map((m) => (m.paymentId === editingMethod.paymentId ? { ...m, paymentName: nameInput.trim() } : m))
                    );
                    toast.success("Cập nhật phương thức thanh toán thành công");
                } else {
                    setError("Không thể cập nhật phương thức thanh toán");
                    toast.error("Không thể cập nhật phương thức thanh toán");
                }
            } else {
                const success = await createPayment(nameInput.trim());
                if (success) {
                    const updatedPayments = await getPayment();
                    setPaymentMethods(updatedPayments);
                    toast.success("Thêm phương thức thanh toán thành công");
                } else {
                    setError("Không thể thêm phương thức thanh toán mới");
                    toast.error("Không thể thêm phương thức thanh toán mới");
                }
            }
        } catch (error) {
            console.error("Error saving payment method:", error);
            setError("Đã xảy ra lỗi khi lưu phương thức thanh toán");
            toast.error("Đã xảy ra lỗi khi lưu phương thức thanh toán");
        }

        closeModal();
    };

    const handleToggleStatus = async (paymentId: string, currentStatus: boolean | undefined) => {
        const isCurrentlyActive = currentStatus === true;
        const actionText = isCurrentlyActive ? "vô hiệu hóa" : "kích hoạt";
        
        const confirmToggle = window.confirm(`Bạn có chắc chắn muốn ${actionText} phương thức thanh toán này?`);
        
        if (confirmToggle) {
            try {
                let success;
                
                if (isCurrentlyActive) {
                    success = await deactivePayment(paymentId);
                } else {
                    success = await activePayment(paymentId);
                }
                
                if (success) {
                    setPaymentMethods((prev) => 
                        prev.map((method) => 
                            method.paymentId === paymentId 
                                ? { ...method, status: !isCurrentlyActive } 
                                : method
                        )
                    );
                    toast.success(`${isCurrentlyActive ? 'Vô hiệu hóa' : 'Kích hoạt'} phương thức thanh toán thành công`);
                } else {
                    toast.error(`Không thể ${actionText} phương thức thanh toán`);
                }
            } catch (error) {
                console.error(`Error ${actionText} payment method:`, error);
                setError(`Đã xảy ra lỗi khi ${actionText} phương thức thanh toán`);
                toast.error(`Đã xảy ra lỗi khi ${actionText} phương thức thanh toán`);
            }
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Phương Thức Thanh Toán</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
                    >
                        + Thêm Phương Thức
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Phương Thức Thanh Toán</h2>
                    {isLoading ? (
                        <div className="text-center py-4">Đang tải...</div>
                    ) : (
                        <table className="w-full border-collapse rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-white text-black">
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Tên Phương Thức</th>
                                    <th className="p-3 text-left">Trạng Thái</th>
                                    <th className="p-3 text-left">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {paymentMethods.length > 0 ? (
                                    paymentMethods.map((method) => (
                                        <tr key={method.paymentId} className="border-t">
                                            <td className="p-3">{method.paymentId}</td>
                                            <td className="p-3">{method.paymentName}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-sm ${method.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {method.status ? 'Đang hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="p-3 flex space-x-2">
                                                <button
                                                    onClick={() => openModal(method)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Chỉnh Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(method.paymentId, method.status)}
                                                    className={`${method.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded`}
                                                >
                                                    {method.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key="no-data">
                                        <td colSpan={4} className="p-3 text-center">
                                            Không có phương thức thanh toán nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            <ManagementModal
                isOpen={isModalOpen}
                title={editingMethod ? "Chỉnh Sửa Phương Thức" : "Thêm Phương Thức"}
                onClose={closeModal}
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        value={nameInput}
                        onChange={handleNameChange}
                        placeholder="Tên phương thức"
                        className={`w-full p-2 border rounded ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {nameError && (
                        <p className="text-red-500 text-sm mt-1">{nameError}</p>
                    )}
                </div>
            </ManagementModal>
        </div>
    );
}