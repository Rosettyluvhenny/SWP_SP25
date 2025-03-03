import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import { Question } from "../data/tracnghiemdata";
import { tracnghiemdata } from "../data/tracnghiemdata";
import { tracnghiemveseodata } from "../data/tracnghiemveseodata";
import { tracnghiemvedaData } from "../data/tracnghiemvedaData";
import { tracnghiemdoimoidata } from "../data/tracnghiemdoimoidata";

export default function QuizManagement() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [questions, setQuestions] = useState<{ [key: string]: Question[] }>({
    "Trắc nghiệm da": tracnghiemdata,
    "Trắc nghiệm về sẹo": tracnghiemveseodata,
    "Trắc nghiệm đồi mồi": tracnghiemdoimoidata,
    "Trắc nghiệm về da": tracnghiemvedaData,
  });

  const handleToggleTest = (test: string) => {
    setSelectedTest(selectedTest === test ? null : test);
  };

  const handleDeleteQuestion = (test: string, index: number) => {
    const updatedQuestions = { ...questions };
    updatedQuestions[test].splice(index, 1); // Xóa câu hỏi
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (test: string, index: number) => {
    const newQuestion = prompt("Nhập câu hỏi mới:", questions[test][index].question);
    if (newQuestion) {
      const updatedQuestions = { ...questions };
      updatedQuestions[test][index].question = newQuestion; // Cập nhật câu hỏi
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản Lý Bài Kiểm Tra</h1>
        <div className="bg-pink-100 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh Sách Bài Kiểm Tra</h2>
          <div>
            {Object.keys(questions).map((test, index) => (
              <div key={index} className="mb-6">
                {/* Tiêu đề bài trắc nghiệm */}
                <div
                  onClick={() => handleToggleTest(test)}
                  className="text-lg font-semibold cursor-pointer flex justify-between items-center bg-white p-3 shadow rounded-lg"
                >
                  {test}
                  <svg
                    className={`w-6 h-6 ml-2 transform transition-transform duration-300 ease-in-out ${
                      selectedTest === test ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Danh sách câu hỏi (chỉ hiển thị nếu bài test được chọn) */}
                {selectedTest === test && (
                  <div className="mt-3 space-y-4">
                    {questions[test].map((q, idx) => (
                      <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-lg font-medium mb-2">{q.question}</p>
                        <div className="pl-4">
                          {q.options.map((option, index) => (
                            <p key={index} className="text-gray-700">- {option}</p>
                          ))}
                        </div>
                        {/* Nút chỉnh sửa và xóa */}
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleEditQuestion(test, idx)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(test, idx)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
