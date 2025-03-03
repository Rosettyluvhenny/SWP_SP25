import { useState } from "react";
import { Question } from "../data/tracnghiemdata";
import { tracnghiemdata } from "../data/tracnghiemdata";
import { tracnghiemveseodata } from "../data/tracnghiemveseodata";
import { tracnghiemvedaData } from "../data/tracnghiemvedaData";
import { tracnghiemdoimoidata } from "../data/tracnghiemdoimoidata";

export default function SkinTest() {
  const questionSets: { [key: string]: Question[] } = {
    "Trắc nghiệm da": tracnghiemdata,
    "Trắc nghiệm về sẹo": tracnghiemveseodata,
    "Trắc nghiệm đồi mồi": tracnghiemdoimoidata,
    "Trắc nghiệm về da": tracnghiemvedaData,
  };

  const [selectedTest, setSelectedTest] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [hasStarted, setHasStarted] = useState<boolean>(false); // Kiểm tra đã bắt đầu hay chưa

  const handleTestChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTest(event.target.value);
    setHasStarted(false);
  };

  const handleStartTest = () => {
    if (selectedTest && questionSets[selectedTest]) {
      setQuestions(questionSets[selectedTest]);
      setAnswers({});
      setHasStarted(true);
    }
  };

  const handleGoBack = () => {
    setHasStarted(false);
    setSelectedTest("");
    setQuestions([]);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Kết quả trắc nghiệm:", answers);
  };

  return (
    <div className="pt-16 flex flex-col">
      {/* Banner Section */}
      <div className="h-72 flex items-center justify-center bg-[url('/assets/skin-title.jpg')] bg-cover bg-no-repeat">
        <div className="text-start text-white">
          <h1 className="text-7xl font-serif leading-tight">Skin Test</h1>
        </div>
      </div>

      {/* Chỉ hiển thị nếu chưa bắt đầu trắc nghiệm */}
      {!hasStarted && (
        <div className="flex flex-col items-center mt-6">
          <h1 className="flex ftext-3xl font-bold text-center">
            Chọn bài trắc nghiệm
          </h1>
          <select
            value={selectedTest}
            onChange={handleTestChange}
            className="p-3 border rounded-lg text-lg"
          >
            <option value="">-- Chọn bài trắc nghiệm --</option>
            {Object.keys(questionSets).map((testName) => (
              <option key={testName} value={testName}>
                {testName}
              </option>
            ))}
          </select>

          {/* Nút bắt đầu */}
          <button
            onClick={handleStartTest}
            disabled={!selectedTest}
            className={`mt-4 px-6 py-3 text-lg font-semibold rounded-lg transition ${
              selectedTest
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Bắt đầu trắc nghiệm
          </button>
        </div>
      )}

      {/* Quiz Section - Hiển thị khi đã bắt đầu */}
      {hasStarted && (
        <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-8 mt-10">
          <div className="flex flex-row  items-center justify-start w-full bg-white text-left ">
            <button
              onClick={handleGoBack}
              className=" text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            >
              ⬅
            </button>
            <div className="pl-40 font-bold text-4xl">
            {selectedTest}        
            </div>
          </div>

          {questions.map((q) => (
            <div
              key={q.id}
              className="p-6 border-2 rounded-2xl shadow-lg bg-gray-100 mb-6"
            >
              <p className="text-lg font-semibold mb-3">{q.question}</p>
              {q.options.map((option) => (
                <label key={option} className="block text-lg">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    className="mr-3"
                    onChange={() => handleAnswerChange(q.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Gửi kết quả
          </button>
        </div>
      )}
    </div>
  );
}
