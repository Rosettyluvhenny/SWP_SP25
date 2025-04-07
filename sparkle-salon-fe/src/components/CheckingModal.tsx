import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { checkInCash } from '../data/staffData';
import { X } from 'lucide-react';
// import { X } from 'lucide-react';

interface CheckingModalProps {
    bookingId: number;
    isOpen: boolean;
    setIsOpen: (check: boolean) => void;
    setReload: (check: boolean) => void;
    reload: boolean;
}
const CheckingModal = ({ bookingId, isOpen, setIsOpen, setReload, reload}: CheckingModalProps) => {
    const [status, setStatus] = useState('PAID');
    const [type, setType] = useState('');
    const [img, setImg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setStatus('PAID');
            setType('');
            setImg(null);
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!type) {
            setError('Please select a payment type');
            return;
        }   

        if (type === 'ONLINE_BANKING' && !img) {
            setError('Please upload payment proof image');
            return;
        }

        try {
            setIsSubmitting(true);

            // Use the provided API function
            const response = await checkInCash(bookingId, status, type, img);
            // console.log("response",response);
            // Handle success
            toast.success(response.message);
            setIsOpen(false);
            setReload(!reload);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update payment status');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl  overflow-hidden transform transition-all duration-300 animate-fadeIn">
                <div className="bg-gradient-to-r from-pink-100 to-rose-200 p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Thanh toán tại quầy</h2>
                </div>

                {error && (
                    <div className="mx-5 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-5 bg-gradient-to-tr from-[#f0bfbf]/30 to-[#ffa8f396]/30">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-xl font-medium font-md-bold mb-2">
                                Trạng thái thanh toán
                            </label>
                            <input
                                type="text"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-white/80 text-gray-500 border border-pink-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-xl font-medium mb-2">
                                Loại thanh toán <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-white/80 border border-pink-100 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent appearance-none transition-all"
                                required
                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                            >
                                <option value="">Chọn loại thanh toán</option>
                                <option value="ONLINE_BANKING">Chuyển khoản</option>
                                <option value="CASH">Tiền mặt</option>
                            </select>
                        </div>

                        {type === 'ONLINE_BANKING' && (
                            <div className="transition-all duration-300 ease-in-out">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Payment Proof Image <span className="text-rose-500">*</span>
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pink-200 border-dashed rounded-lg bg-white/70 hover:border-rose-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-pink-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500">
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => setImg(e.target.files[0])}
                                                    required
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition-all"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg text-white font-medium shadow-sm hover:from-rose-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Update Payment'}
                        </button>
                    </div>
                </form>

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-full p-1"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default CheckingModal;