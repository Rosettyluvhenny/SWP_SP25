import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";

export default function TherapistManagement() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPayments();
    }, []);

    const openModal = (method: PaymentMethod | null = null) => {
        setEditingMethod(method);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMethod(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const paymentName = formData.get("name") as string;

        try {
            if (editingMethod) {
                const success = await updatePayment(editingMethod.paymentId, paymentName);
                if (success) {
                    setPaymentMethods((prev) => 
                        prev.map((m) => (m.paymentId === editingMethod.paymentId ? { ...m, paymentName: paymentName } : m))
                    );
                } else {
                    setError("Không thể cập nhật phương thức thanh toán");
                }
            } else {
                const success = await createPayment(paymentName);
                if (success) {
                    const updatedPayments = await getPayment();
                    setPaymentMethods(updatedPayments);
                } else {
                    setError("Không thể thêm phương thức thanh toán mới");
                }
            }
        } catch (error) {
            console.error("Error saving payment method:", error);
            setError("Đã xảy ra lỗi khi lưu phương thức thanh toán");
        }

        closeModal();
    };

    const handleDelete = async (paymentId: string) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phương thức thanh toán này?");
        if (confirmDelete) {
            try {
                const success = await deletePayment(paymentId);
                if (success) {
                    setPaymentMethods((prev) => prev.filter((method) => method.paymentId !== paymentId));
                    setError(null);
                } else {
                    setError("Không thể xóa phương thức thanh toán");
                }
            } catch (error) {
                console.error("Error deleting payment method:", error);
                setError("Đã xảy ra lỗi khi xóa phương thức thanh toán");
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
                                    <th className="p-3 text-left">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {paymentMethods.length > 0 ? (
                                    paymentMethods.map((method) => (
                                        <tr key={method.paymentId} className="border-t">
                                            <td className="p-3">{method.paymentId}</td>
                                            <td className="p-3">{method.paymentName}</td>
                                            <td className="p-3 flex space-x-2">
                                                <button
                                                    onClick={() => openModal(method)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Chỉnh Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(method.paymentId)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key="no-data">
                                        <td colSpan={3} className="p-3 text-center">
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
                <input
                    type="text"
                    name="name"
                    defaultValue={editingMethod?.paymentName || ""}
                    placeholder="Tên phương thức"
                    className="w-full p-2 border rounded"
                    required
                />
            </ManagementModal>
        </div>
    );
}