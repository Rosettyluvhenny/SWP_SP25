import { useState } from "react";
import { Question } from "../data/tracnghiemdata";
import { tracnghiemdata } from "../data/tracnghiemdata";
import { tracnghiemmun } from "../data/tracnghiemmun";
import { tracnghiemseodata } from "../data/tracnghiemseodata";
import { tracnghiemvedadata } from "../data/tracnghiemvedaData";

export default function SkinTest() {
  const questionSets: { [key: string]: Question[] } = {
    "Trắc nghiệm da": tracnghiemdata,
    "Trắc nghiệm về sẹo": tracnghiemmun,
    "Trắc nghiệm đồi mồi": tracnghiemseodata,
    "Trắc nghiệm về da": tracnghiemvedadata,
  };

  const [selectedTest, setSelectedTest] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleStartTest = () => {
    if (selectedTest && questionSets[selectedTest]) {
      setQuestions(questionSets[selectedTest]);
      setAnswers({});
      setHasStarted(true);
      setShowResults(false);
    }
  };

  const handleGoBack = () => {
    setHasStarted(false);
    setSelectedTest("");
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerChange = (questionId: number, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalScore = Object.values(answers).reduce(
    (acc, points) => acc + points,
    0
  );
  let resultMessage = "";
  if (totalScore <= 5) resultMessage = "Tình trạng nhẹ, không đáng lo ngại.";
  else if (totalScore <= 10)
    resultMessage = "Tình trạng trung bình, cần chú ý chăm sóc.";
  else if (totalScore <= 15)
    resultMessage = "Tình trạng nghiêm trọng, nên tham khảo ý kiến bác sĩ.";
  else
    resultMessage =
      "Tình trạng rất nghiêm trọng, cần được kiểm tra bởi chuyên gia.";

  return (
    <div className="pt-16 flex flex-col">
      <div className="h-72 flex items-center justify-center bg-[url('/assets/skin-title.jpg')] bg-cover bg-no-repeat">
        <div className="text-start text-white">
          <h1 className="text-7xl font-serif leading-tight">Skin Test</h1>
        </div>
      </div>

      {!hasStarted && !showResults && (
        <div className="flex flex-col items-center mt-6">
          <h1 className="py-8 text-4xl font-bold text-center">
            Chọn bài trắc nghiệm
          </h1>
          <div className="p-3 border rounded-lg text-2xl">
            {Object.keys(questionSets).map((testName) => (
              <div key={testName} className="mb-2">
                <label className="cursor-pointer pl-2">
                  <input
                    type="radio"
                    name="questionSet"
                    value={testName}
                    checked={selectedTest === testName}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    className="mr-4 "
                  />
                  {testName}
                </label>
              </div>
            ))}
          </div>
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

      {hasStarted && (
        <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-8 mt-10">
          <div className="flex flex-row items-center justify-start w-full bg-white text-left">
          <button
  onClick={handleGoBack}
  className=" py-2 px-4 rounded-lg hover:bg-gray-300 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 19l-7-7m0 0 7-7m-7"
 
      />
  </svg>
</button>

            <div className="pl-16 font-bold text-4xl">{selectedTest}</div>
          </div>

          {questions.map((q) => (
            <div
              key={q.id}
              className="p-6 border-2 rounded-2xl shadow-lg bg-gray-100 mb-6"
            >
              <p className="text-lg font-semibold mb-3">{q.question}</p>
              {q.options.map((option) => (
                <label key={option.text} className="block text-lg">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option.points}
                    className="mr-3"
                    onChange={() => handleAnswerChange(q.id, option.points)}
                  />
                  {option.text}
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

      {showResults && (
        <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 mt-10">
          <h2 className="text-3xl font-bold text-center">
            Kết quả trắc nghiệm
          </h2>
          <p className="text-xl font-semibold text-center">
            Tổng điểm: {totalScore}
          </p>
          <p className="text-lg text-center">{resultMessage}</p>
          <button
            onClick={handlePrint}
            className="w-full bg-green-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-green-700 transition"
          >
            In kết quả
          </button>
        </div>
      )}
    </div>
  );
}
