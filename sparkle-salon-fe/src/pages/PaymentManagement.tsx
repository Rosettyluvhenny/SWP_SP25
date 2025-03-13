import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import {createPayment, getPayment, deletePayment, updatePayment} from "../data/paymentData";

type PaymentMethod = {
    id: number;
    name: string;
};

export default function PaymentManagement() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const payments = await getPayment();
                setPaymentMethods(payments);
            } catch (error) {
                console.error("Error fetching payment methods:", error);
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
                await updatePayment(editingMethod.id, paymentName);
                setPaymentMethods((prev) => prev.map((m) => (m.id === editingMethod.id ? { ...m, name: paymentName } : m)));
            } else {
                await createPayment(paymentName);
                const updatedPayments = await getPayment();
                setPaymentMethods(updatedPayments);
            }
        } catch (error) {
            console.error("Error saving payment method:", error);
        }

        closeModal();
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phương thức thanh toán này?");
        if (confirmDelete) {
            try {
                await deletePayment(id);
                setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
            } catch (error) {
                console.error("Error deleting payment method:", error);
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

                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Phương Thức Thanh Toán</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Tên Phương Thức</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {paymentMethods.map((method) => (
                                <tr key={method.id} className="border-t">
                                    <td className="p-3">{method.id}</td>
                                    <td className="p-3">{method.name}</td>
                                    <td className="p-3 flex space-x-2">
                                        <button
                                            onClick={() => openModal(method)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Chỉnh Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(method.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                    defaultValue={editingMethod?.name || ""}
                    placeholder="Tên phương thức"
                    className="w-full p-2 border rounded"
                    required
                />
            </ManagementModal>
        </div>
    );
}
