import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  multiple: boolean;
  correctAnswers: string[];
};

export default function CreateQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]); // Định nghĩa kiểu dữ liệu

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), question: "", options: [""], multiple: false, correctAnswers: [] },
    ]);
  };

  const updateQuestion = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: value } : q))
    );
  };

  const updateOption = (qId: number, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) } : q
      )
    );
  };

  const addOption = (qId: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (qId: number, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, options: q.options.filter((_, i) => i !== index) } : q
      )
    );
  };

  const toggleCorrectAnswer = (qId: number, option: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const isSelected = q.correctAnswers.includes(option);
          return {
            ...q,
            correctAnswers: isSelected
              ? q.correctAnswers.filter((ans) => ans !== option)
              : [...q.correctAnswers, option],
          };
        }
        return q;
      })
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const saveQuiz = () => {
    console.log("Quiz saved:", questions);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Tạo bài trắc nghiệm</h1>
      <button
        onClick={addQuestion}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Thêm câu hỏi
      </button>
      {questions.map((q) => (
        <div key={q.id} className="mt-6 p-4 border rounded-lg shadow-md bg-white">
          <input
            type="text"
            placeholder="Nhập câu hỏi"
            value={q.question}
            onChange={(e) => updateQuestion(q.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
          {q.options.map((opt, index) => (
            <div key={index} className="mt-2 flex items-center">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(q.id, index, e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="checkbox"
                checked={q.correctAnswers.includes(opt)}
                onChange={() => toggleCorrectAnswer(q.id, opt)}
                className="ml-2"
              />
              <button
                onClick={() => removeOption(q.id, index)}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            onClick={() => addOption(q.id)}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            Thêm đáp án
          </button>
          <button
            onClick={() => deleteQuestion(q.id)}
            className="ml-2 px-3 py-1 bg-red-600 text-white rounded"
          >
            Xóa câu hỏi
          </button>
        </div>
      ))}
      <button
        onClick={saveQuiz}
        className="mt-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Lưu bài trắc nghiệm
      </button>
    </div>
  );
}
