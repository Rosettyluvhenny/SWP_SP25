// QuestionItem.tsx
import React from "react";
import { Question } from "../data/quizData";

interface QuestionItemProps {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <span>{question.text}</span>
        <div>
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
          >
            Sửa
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>
      <ul className="mt-2">
        {question.answers.map((answer) => (
          <li key={answer.id}>
            {answer.text} (Điểm: {answer.point})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionItem;
