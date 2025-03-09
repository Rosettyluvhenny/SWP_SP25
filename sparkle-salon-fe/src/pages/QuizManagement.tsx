// src/pages/QuizManagement.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import { Question } from "../data/quizData"; // Đảm bảo rằng Question type được định nghĩa đúng
import { Link } from "react-router-dom";
import { fetchQuizzes, deleteQuestion, updateQuestion, handleApiError } from "../api/quizApi";

export default function QuizManagement() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [questions, setQuestions] = useState<{ [key: string]: Question[] }>({});
  const [editing, setEditing] = useState<{
    test: string;
    index: number;
  } | null>(null);
  const [editData, setEditData] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  // Hàm lấy danh sách bài kiểm tra từ API
  const fetchQuizzesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuizzes();
      setQuestions(data); // Giả sử API trả về dữ liệu dạng { "quizName1": [...], "quizName2": [...], ... }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchQuizzesData();
  }, []);

  const toggleTest = (test: string) =>
    setSelectedTest(selectedTest === test ? null : test);

  // Xóa câu hỏi bằng cách gọi API
  const handleDeleteQuestion = async (test: string, index: number) => {
    try {
      const questionId = questions[test][index].id; // Giả sử mỗi câu hỏi có thuộc tính id
      await deleteQuestion(test, questionId);
      setQuestions((prev) => ({
        ...prev,
        [test]: prev[test].filter((_, idx) => idx !== index),
      }));
      setError(null); // Xóa thông báo lỗi nếu thành công
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const editQuestion = (test: string, index: number) => {
    setEditing({ test, index });
    setEditData({ ...questions[test][index] });
  };

  // Lưu câu hỏi bằng cách gọi API
  const saveQuestion = async () => {
    if (editing && editData) {
      try {
        const questionId = editData.id; // Giả sử mỗi câu hỏi có thuộc tính id
        await updateQuestion(editing.test, questionId, editData);
        setQuestions((prev) => ({
          ...prev,
          [editing.test]: prev[editing.test].map((q, idx) =>
            idx === editing.index ? editData : q
          ),
        }));
        setEditing(null);
        setEditData(null);
        setError(null); // Xóa thông báo lỗi nếu thành công
      } catch (err) {
        setError(handleApiError(err));
      }
    }
  };

  if (loading) {
    return <div className="flex h-screen justify-center items-center">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center text-red-500">
        {error}
        <button
          onClick={fetchQuizzesData}
          className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-md"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý Bài Kiểm Tra
          </h1>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
            <Link to="/manager/createrquiz">+ Thêm Bài Kiểm Tra</Link>
          </button>
        </div>

        <div className="bg-pink-100 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh Sách Bài Kiểm Tra</h2>

          {Object.keys(questions).map((test, index) => (
            <div key={index} className="mb-6">
              <div
                onClick={() => toggleTest(test)}
                className="text-lg font-semibold cursor-pointer flex justify-between items-center bg-white p-3 shadow rounded-lg"
              >
                {test}
                <svg
                  className={`w-6 h-6 ml-2 transform transition-transform duration-300 ${
                    selectedTest === test ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {selectedTest === test && (
                <div className="mt-3 space-y-4">
                  {questions[test].map((q, idx) =>
                    editing?.test === test && editing.index === idx ? (
                      <QuestionEditor
                        key={idx}
                        editData={editData}
                        setEditData={setEditData}
                        saveQuestion={saveQuestion}
                        cancelEdit={() => setEditing(null)}
                      />
                    ) : (
                      <QuestionItem
                        key={idx}
                        question={q}
                        onEdit={() => editQuestion(test, idx)}
                        onDelete={() => handleDeleteQuestion(test, idx)}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Các component QuestionItem và QuestionEditor không thay đổi, giữ nguyên như cũ
function QuestionItem({
  question,
  onEdit,
  onDelete,
}: {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-medium mb-2">{question.question}</p>
      <div className="pl-4">
        {question.options.map((option, index) => (
          <p key={index} className="text-gray-700">
            - {option.text} (Điểm: {option.points})
          </p>
        ))}
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-3 py-1 rounded-md"
        >
          Sửa
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

function QuestionEditor({
  editData,
  setEditData,
  saveQuestion,
  cancelEdit,
}: {
  editData: Question | null;
  setEditData: React.Dispatch<React.SetStateAction<Question | null>>;
  saveQuestion: () => void;
  cancelEdit: () => void;
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-2">
      Câu hỏi
      <input
        type="text"
        className="w-full p-2 border rounded-lg"
        value={editData?.question || ""}
        onChange={(e) =>
          setEditData((prev) => prev && { ...prev, question: e.target.value })
        }
      />
      câu trả lời
      {editData?.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={option.text}
            onChange={(e) =>
              setEditData((prev) =>
                prev
                  ? {
                      ...prev,
                      options: prev.options.map((opt, i) =>
                        i === index ? { ...opt, text: e.target.value } : opt
                      ),
                    }
                  : prev
              )
            }
          />
          <input
            type="number"
            className="w-20 p-2 border rounded-lg"
            min="0"
            value={option.points}
            onChange={(e) =>
              setEditData((prev) =>
                prev
                  ? {
                      ...prev,
                      options: prev.options.map((opt, i) =>
                        i === index
                          ? { ...opt, points: parseInt(e.target.value) || 0 }
                          : opt
                      ),
                    }
                  : prev
              )
            }
          />
        </div>
      ))}
      <div className="flex justify-end space-x-2">
        <button
          onClick={saveQuestion}
          className="bg-green-500 text-white px-3 py-1 rounded-md"
        >
          Lưu
        </button>
        <button
          onClick={cancelEdit}
          className="bg-gray-500 text-white px-3 py-1 rounded-md"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}