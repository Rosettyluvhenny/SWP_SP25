import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import { Question } from "../data/tracnghiemdata";
import { tracnghiemdata } from "../data/tracnghiemdata";
import { tracnghiemseodata } from "../data/tracnghiemseodata";
import { tracnghiemmun } from "../data/tracnghiemmun";
import { tracnghiemvedadata } from "../data/tracnghiemvedaData";
import { Link } from "react-router-dom";

export default function QuizManagement() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [questions, setQuestions] = useState<{ [key: string]: Question[] }>({
    "Trắc nghiệm da": tracnghiemdata,
    "Trắc nghiệm về sẹo": tracnghiemseodata,
    "Trắc nghiệm đồi mồi": tracnghiemmun,
    "Trắc nghiệm về da": tracnghiemvedadata,
  });

  const [editing, setEditing] = useState<{
    test: string;
    index: number;
  } | null>(null);
  const [editData, setEditData] = useState<Question | null>(null);

  const toggleTest = (test: string) =>
    setSelectedTest(selectedTest === test ? null : test);

  const deleteQuestion = (test: string, index: number) => {
    setQuestions((prev) => ({
      ...prev,
      [test]: prev[test].filter((_, idx) => idx !== index),
    }));
  };

  const editQuestion = (test: string, index: number) => {
    setEditing({ test, index });
    setEditData({ ...questions[test][index] });
  };

  const saveQuestion = () => {
    if (editing && editData) {
      setQuestions((prev) => ({
        ...prev,
        [editing.test]: prev[editing.test].map((q, idx) =>
          idx === editing.index ? editData : q
        ),
      }));
      setEditing(null);
      setEditData(null);
    }
  };

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
                        onDelete={() => deleteQuestion(test, idx)}
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
