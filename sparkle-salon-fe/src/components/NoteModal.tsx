import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { updateBookingSession } from "../data/sessionData";
import { FaBookMedical, FaAddressBook, FaUser } from "react-icons/fa";
import { CalendarIcon, DocumentPlusIcon, XMarkIcon, ArrowUpOnSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const NoteModal = ({ session, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState(session?.note || "");
  const [imgBeforeFile, setImgBeforeFile] = useState(null);
  const [imgAfterFile, setImgAfterFile] = useState(null);
  const [imgBeforePreview, setImgBeforePreview] = useState(null);
  const [imgAfterPreview, setImgAfterPreview] = useState(null);
  const modalRef = useRef(null);
  const noteRef = useRef(null);

  // Focus on note input when modal opens
  useEffect(() => {
    if (noteRef.current) {
      setTimeout(() => noteRef.current.focus(), 100);
    }
  }, []);

  // Handle clicking outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!isSubmitting) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSubmitting, onClose]);

  // Generate preview URLs for selected images
  useEffect(() => {
    if (imgBeforeFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImgBeforePreview(reader.result);
      reader.readAsDataURL(imgBeforeFile);
    }
    
    if (imgAfterFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImgAfterPreview(reader.result);
      reader.readAsDataURL(imgAfterFile);
    }
  }, [imgBeforeFile, imgAfterFile]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!note.trim()) {
      toast.error("Vui lòng nhập ghi chú cho buổi trị liệu");
      return;
    }
    
    if ((!imgBeforeFile && !session.imgBefore) || (!imgAfterFile && !session.imgAfter)) {
      toast.error("Vui lòng tải lên cả hai hình ảnh trước và sau");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const updateRequest = {
        note,
        roomId: session?.roomId || 0,
      };
      
      await updateBookingSession(
        session.id,
        updateRequest,
        imgBeforeFile,
        imgAfterFile
      );
      
      toast.success("Cập nhật buổi trị liệu thành công");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Không thể cập nhật: " + (error.message || "Đã xảy ra lỗi"));
      console.error("Lỗi cập nhật:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước hình ảnh quá lớn. Vui lòng chọn hình ảnh dưới 10MB");
      return;
    }
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error("Vui lòng chỉ tải lên các file hình ảnh");
      return;
    }
    
    if (type === 'before') {
      setImgBeforeFile(file);
    } else {
      setImgAfterFile(file);
    }
  };

  // Format session date
  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const ImageDisplay = ({ currentImage, previewImage, altText }) => {
    const imageToShow = previewImage || currentImage;
    
    if (!imageToShow) return (
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <ArrowUpOnSquareIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
    
    return (
      <div className="relative border border-gray-200 p-1 rounded-lg bg-gray-50 shadow-sm group">
        <a 
          href={previewImage ? previewImage : `${currentImage}?t=${Date.now()}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block"
        >
          <img
            src={previewImage ? previewImage : `${currentImage}?t=${Date.now()}`}
            alt={altText}
            className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition-opacity"
            onError={(e) => {
              console.error("Image failed to load:", e);
              e.currentTarget.src = '/placeholder-image.png'; 
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-all rounded-lg">
            <span className="text-white opacity-0 group-hover:opacity-100 font-medium">
              Xem chi tiết
            </span>
          </div>
        </a>
        {previewImage && (
          <div className="absolute -top-2 -right-2">
            <CheckCircleIcon className="w-6 h-6 text-green-500 bg-white rounded-full" />
          </div>
        )}
      </div>
    );
  };

  const FileUploadInput = ({ id, onChange, disabled }) => (
    <div className="relative">
      <input
        type="file"
        id={id}
        name={id}
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={onChange}
        disabled={disabled}
      />
      <label 
        htmlFor={id}
        className="flex items-center justify-center w-full px-4 py-2 text-sm bg-pink-50 text-pink-700 border border-pink-100 hover:bg-pink-100 rounded-lg transition cursor-pointer"
      >
        <ArrowUpOnSquareIcon className="w-5 h-5 mr-2" />
        Tải lên hình ảnh
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-t from-pink-600 to-pink-500 text-white px-6 py-4">
          <h2 className="text-xl font-semibold flex items-center">
            <DocumentPlusIcon className="w-6 h-6 mr-2" />
            Ghi chú buổi trị liệu
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-pink-700 transition-colors"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Session details */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-pink-500" />
                  Chi tiết buổi
                </h2>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-gray-700 flex items-center">
                    <FaBookMedical className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-gray-500 w-28">ID buổi:</span> 
                    <span className="font-medium">{session.id}</span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FaAddressBook className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-gray-500 w-28">ID Đặt lịch:</span>
                    <span className="font-medium">{session.bookingId}</span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <FaUser className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-gray-500 w-28">Khách hàng:</span> 
                    <span className="font-medium">{session.userName}</span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-gray-500 w-28">Ngày:</span> 
                    <span className="font-medium">{formatSessionDate(session.sessionDateTime)}</span>
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <DocumentPlusIcon className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-gray-500 w-28">Dịch vụ:</span> 
                    <span className="font-medium">{session.serviceName}</span>
                  </p>
                </div>
              </div>
              
              {/* Note input */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <DocumentPlusIcon className="w-5 h-5 mr-2 text-pink-500" />
                  Ghi chú buổi
                </h2>
                <textarea
                  ref={noteRef}
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-pink-500 focus:border-pink-500 shadow-sm h-40"
                  placeholder="Nhập ghi chú chi tiết cho buổi trị liệu tại đây..."
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Image uploads */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <ArrowUpOnSquareIcon className="w-5 h-5 mr-2 text-pink-500" />
                Hình ảnh trước và sau trị liệu
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Before image */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded mr-2 text-lg">Trước khi trị liệu</span>
                  </label>
                  <ImageDisplay 
                    currentImage={session.imgBefore} 
                    previewImage={imgBeforePreview}
                    altText="Hình ảnh trước khi trị liệu" 
                  />
                  <FileUploadInput 
                    id="imgBefore" 
                    onChange={(e) => handleImageChange(e, 'before')}
                    disabled={isSubmitting} 
                  />
                </div>
                
                {/* After image */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2 text-lg">Sau khi trị liệu</span>
                  </label>
                  <ImageDisplay 
                    currentImage={session.imgAfter} 
                    previewImage={imgAfterPreview}
                    altText="Hình ảnh sau khi trị liệu" 
                  />
                  <FileUploadInput 
                    id="imgAfter" 
                    onChange={(e) => handleImageChange(e, 'after')}
                    disabled={isSubmitting} 
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition shadow-sm font-medium"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition shadow-sm font-medium flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang cập nhật...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5 mr-1" />
                Cập nhật
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;