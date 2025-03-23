import React from "react";

interface QuizResultProps {
  result: string;
  error: string | null;
  fetchingResult: boolean;
  onLink: () => void;
  onBack: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({
  result,
  error,
  fetchingResult,
  onLink,
  onBack
}) => (
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 mt-10">
    <h2 className="text-3xl font-bold text-center">Kết Quả Kiểm Tra</h2>
    {fetchingResult ? (
      <p className="text-lg text-center text-gray-500">Đang tải kết quả...</p>
    ) : error ? (
      <p className="text-lg text-center text-red-600">{error}</p>
    ) : (
      <p className="text-lg text-center">{result || "Không có kết quả để hiển thị"}</p>
    )}
    <button
    onClick={onLink}
      className="w-full bg-green-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-green-700 transition"
    >
     Chi tiết về da của bạn 
    </button>
    <button
      onClick={onBack}
      className="w-full bg-gray-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-gray-700 transition"
    >
      Làm Lại Bài Kiểm Tra
    </button>
  </div>
);

export default QuizResult;