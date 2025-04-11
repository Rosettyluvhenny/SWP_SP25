import { useState } from 'react';
import { Quiz } from '../data/quizData';

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (answers: { [key: number]: number }) => void;
  onBack: () => void;
  submitting?: boolean;
}

export default function QuizInterface({ quiz, onComplete, onBack, submitting = false }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: { selectedOption: number; point: number } }>({});

  const handleAnswer = (index: number, point: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: { selectedOption: index, point }
    }));

    if (currentQuestion < quiz.questions.length - 1) {
      // setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      // }, 300);
    }
  };

  const handleSubmit = () => {
    if (submitting) return;

    const answers = Object.entries(userAnswers).reduce((acc, [questionIndex, { point }]) => {
      acc[quiz.questions[Number(questionIndex)].id] = point;
      return acc;
    }, {} as { [key: number]: number });
    onComplete(answers);
  };

  return (
    <div className="flex h-[1200px] bg-white">
      <main className="flex-1 mt-[150px] p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <button
                  onClick={onBack}
                  disabled={submitting}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold">{quiz.name}</h1>
              </div>
              <span className="text-gray-500">
                Câu hỏi {currentQuestion + 1}/{quiz.questions.length}
              </span>
            </div>
            {/* Hiển thị điểm tạm thời */}
            
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">
              {quiz.questions[currentQuestion].text}
            </h2>
            <div className="space-y-3">
              {quiz.questions[currentQuestion].answers.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(index, option.point)}
                  disabled={submitting}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    userAnswers[currentQuestion]?.selectedOption === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={submitting}
                className="px-4 py-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
              >
                ← Câu hỏi trước
              </button>
            )}
            {currentQuestion === quiz.questions.length - 1 && (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(userAnswers).length !== quiz.questions.length}
                className={`px-6 py-2 rounded-lg text-white transition-colors ${
                  Object.keys(userAnswers).length === quiz.questions.length
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-400'
                } disabled:opacity-50 flex items-center`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  'Hoàn thành'
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}