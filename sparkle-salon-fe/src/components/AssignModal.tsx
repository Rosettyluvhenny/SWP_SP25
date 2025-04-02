import React from "react";

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
};

export default function AssignModal({
    isOpen,
    title,
    onClose,
    onSubmit,
    children,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-3/5"
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 id="modal-title" className="text-lg font-semibold mb-4">
                    {title}
                </h2>
                <form onSubmit={onSubmit}>
                    {children}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                        >
                            Hủy
                        </button>
                        <button
                            // type="submit"
                            onClick={(e)=>{e.preventDefault(); onSubmit(e)}}
                            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
