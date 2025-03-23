// src/components/QuestionEditor.tsx
import React, { useState } from "react";
import { Question, Answer } from "../data/quizData";

interface QuestionEditorProps {
  editData: Question | null;
  setEditData: React.Dispatch<React.SetStateAction<Question | null>>;
  saveQuestion: () => void;
  cancelEdit: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  editData,
  setEditData,
  saveQuestion,
  cancelEdit,
}) => {
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newAnswerPoint, setNewAnswerPoint] = useState(0);

  if (!editData) return null;

  const addAnswer = () => {
    if (!newAnswerText.trim()) return;
    const newAnswer: Answer = {
      id: Date.now(), // ID tạm thời, backend sẽ cập nhật
      text: newAnswerText,
      point: newAnswerPoint,
    };
    setEditData({
      ...editData,
      answers: [...editData.answers, newAnswer],
    });
    setNewAnswerText("");
    setNewAnswerPoint(0);
  };

  const updateAnswer = (id: number, field: keyof Answer, value: string | number) => {
    setEditData({
      ...editData,
      answers: editData.answers.map((answer) =>
        answer.id === id ? { ...answer, [field]: value } : answer
      ),
    });
  };

  const deleteAnswer = (id: number) => {
    setEditData({
      ...editData,
      answers: editData.answers.filter((answer) => answer.id !== id),
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <input
        type="text"
        value={editData.text}
        onChange={(e) => setEditData({ ...editData, text: e.target.value })}
        className="w-full p-2 border rounded-md mb-2"
        placeholder="Nhập nội dung câu hỏi"
      />

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Câu trả lời</h3>
        {editData.answers.map((answer) => (
          <div key={answer.id} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={answer.text}
              onChange={(e) => updateAnswer(answer.id, "text", e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Nội dung câu trả lời"
            />
            <input
              type="number"
              value={answer.point}
              onChange={(e) => updateAnswer(answer.id, "point", Number(e.target.value))}
              className="w-20 p-2 border rounded-md"
              placeholder="Điểm"
            />
            <button
              onClick={() => deleteAnswer(answer.id)}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="Thêm câu trả lời mới"
          />
          <input
            type="number"
            value={newAnswerPoint}
            onChange={(e) => setNewAnswerPoint(Number(e.target.value))}
            className="w-20 p-2 border rounded-md"
            placeholder="Điểm"
          />
          <button
            onClick={addAnswer}
            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
          >
            Thêm
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={saveQuestion}
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
        >
          Lưu
        </button>
        <button
          onClick={cancelEdit}
          className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;