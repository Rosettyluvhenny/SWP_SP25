import React from "react";

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, onSubmit, children }) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    {children}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
