import { motion } from "framer-motion";
import { QuizResult, quizResultbyId } from "./quizApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



interface QuizResultModalProps {
  quizResult: number | null; // Explicitly allow null
  onClose: () => void;
}

export function QuizResultModal({ quizResult, onClose }: QuizResultModalProps) {
  const navigate = useNavigate();
  const [fetchedResult, setFetchedResult] = useState<QuizResult[] | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      // Only fetch if no result and has ID
      try {
        if (quizResult) {
          const data = await quizResultbyId(quizResult);
          setFetchedResult(data);
        }
      } catch (error) {
        console.error("Error fetching quiz result:", error);
      }
    };
    fetchResult();
  }, [quizResult]);
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const contentVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  };

  if (!fetchedResult) {
    return (
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          variants={contentVariants}
          className="bg-white p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-pink-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-pink-800 mb-3">
              Skin Analysis
            </h3>
            <p className="text-gray-700">No results to display</p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        className="bg-white p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-pink-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-pink-800 mb-3">
            Skin Analysis
          </h3>
          <p className="text-gray-700">
            {fetchedResult.resultText || "No results to display"}
          </p>
        </div>
        <h3 className="text-2xl font-bold text-center text-pink-800 mb-8">
          Dịch Vụ Gợi Ý Cho Bạn
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {fetchedResult.services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/service/${service.id}`)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-800 text-center">
                  {service.name}
                </h4>
                <div className="mt-2 flex justify-center">
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                    Xem Chi Tiết
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
