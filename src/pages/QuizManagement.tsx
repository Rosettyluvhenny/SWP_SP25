import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import {
  fetchQuizzes,
  deleteQuestion,
  handleApiError,
  Quiz,
  Question,
  updateQuestionText,
  updateAnswers,
  fetchQuizResults,
  QuizResult,
  deleteQuizResult,
  updateQuizResult,
  createNewQuestion,
  createNewQuiz,
  updateQuiz,
  deleteQuiz,
  Answer,
  deleteAnswer,
} from "../components/quizApi";
import QuestionItem from "../components/QuestionItem";
import QuestionEditor from "../components/QuestionEditor";
import { motion } from "framer-motion";

export default function QuizManagement() {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<{
    quizId: number;
    index: number;
  } | null>(null);
  const [answer, setAnswer] = useState<Answer[]>([]);

  const [editQuestionData, setEditQuestionData] = useState<Question | null>(
    null
  );
  const [creatingQuestionForQuiz, setCreatingQuestionForQuiz] = useState<
    number | null
  >(null);
  const [editingResult, setEditingResult] = useState<number | null>(null);
  const [editResultData, setEditResultData] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"quiz" | "result">("quiz");
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editQuizData, setEditQuizData] = useState<Quiz | null>(null); // Dữ liệu quiz đang chỉnh sửa
  const [creatingQuiz, setCreatingQuiz] = useState<boolean>(false); // State để tạo quiz mới

  const fetchQuizzesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizzesData = await fetchQuizzes();
      // Chuẩn hóa dữ liệu: đảm bảo questions luôn là mảng
      const normalizedQuizzes = quizzesData.map((quiz) => ({
        ...quiz,
        questions: quiz.questions || [],
      }));
      setQuizzes(normalizedQuizzes);
  
      // Đồng bộ state answer
      const allAnswers = normalizedQuizzes.flatMap((quiz) =>
        quiz.questions.flatMap((question) => question.answers || [])
      );
      console.log("Quizzes từ API:", quizzesData);

      setAnswer(allAnswers);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResultsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultsData = await fetchQuizResults();
      setQuizResults(resultsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesData();
    fetchQuizResultsData();
  }, []);

  const toggleQuiz = (quizId: number) =>
    setSelectedQuizId(selectedQuizId === quizId ? null : quizId);

  const handleDeleteQuestion = async (quizId: number, questionId: number) => {
    try {
      setMutationLoading(true);
  console.log(answer);
      // Lấy danh sách answers của câu hỏi trước khi xóa
      const quiz = quizzes.find((q) => q.id === quizId);
      const question = quiz?.questions.find((q) => q.id === questionId);
      const answerIds = question?.answers.map((a) => a.id) || [];
  
      // Xóa tất cả answers liên quan
      if (answerIds.length > 0) {
        await Promise.all(answerIds.map((answerId) => deleteAnswer(answerId)));
      }
  
      // Xóa câu hỏi
      await deleteQuestion(questionId);
  
      // Cập nhật state quizzes
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quizId
            ? {
                ...q,
                questions: q.questions.filter((q) => q.id !== questionId),
              }
            : q
        )
      );
  
      // Cập nhật state answer (xóa tất cả answers liên quan)
      setAnswer((prev) => prev.filter((a) => !answerIds.includes(a.id)));
  
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setMutationLoading(false);
    }
  };
  
   const editQuestion = (quizId: number, index: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setEditingQuestion({ quizId, index });
      setEditQuestionData({ ...quiz.questions[index] });
    }
  };

  const handleCreateNewQuestion = (quizId: number) => {
    setCreatingQuestionForQuiz(quizId);
    setEditQuestionData({
      id: 0,
      text: "",
      type: "multiple-choice",
      answers: [],
    });
  };

  const saveQuestion = async () => {
    if (!editQuestionData) return;
    try {
      setMutationLoading(true);
      if (!editQuestionData.answers || editQuestionData.answers.length === 0) {
        throw new Error("Câu hỏi phải có ít nhất một câu trả lời!");
      }
      if (creatingQuestionForQuiz) {
        const quiz = quizzes.find((q) => q.id === creatingQuestionForQuiz);
        if (!quiz) throw new Error("Không tìm thấy quiz để thêm câu hỏi!");
        const newQuestion = await createNewQuestion(quiz, {
          ...editQuestionData,
          answers: [],
        });
        const updatedAnswers = editQuestionData.answers.map((answer) => ({
          ...answer,
          questionId: newQuestion.id,
        }));
        await updateAnswers(newQuestion, updatedAnswers);
        setQuizzes((prev) =>
          prev.map((q) =>
            q.id === creatingQuestionForQuiz
              ? {
                  ...q,
                  questions: [
                    ...q.questions,
                    { ...newQuestion, answers: updatedAnswers },
                  ],
                }
              : q
          )
        );
        setCreatingQuestionForQuiz(null);
      } else if (editingQuestion) {
        const quiz = quizzes.find((q) =>
          q.questions.some((qs) => qs.id === editQuestionData.id)
        );
        if (!quiz) throw new Error("Không tìm thấy quiz chứa câu hỏi này!");
        await updateQuestionText(quiz, editQuestionData);
        await updateAnswers(editQuestionData, editQuestionData.answers);
        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz.questions.some((q) => q.id === editQuestionData.id)
              ? {
                  ...quiz,
                  questions: quiz.questions.map((q) =>
                    q.id === editQuestionData.id ? editQuestionData : q
                  ),
                }
              : quiz
          )
        );
        setEditingQuestion(null);
      }
      setEditQuestionData(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteQuizResult = async (resultId: number) => {
    try {
      setMutationLoading(true);
      await deleteQuizResult(resultId);
      setQuizResults((prev) => prev.filter((result) => result.id !== resultId));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const editQuizResult = (resultId: number) => {
    const result = quizResults.find((r) => r.id === resultId);
    if (result) {
      setEditingResult(resultId);
      setEditResultData({ ...result });
    }
  };

  const saveQuizResult = async () => {
    if (editResultData) {
      try {
        setMutationLoading(true);
        const updatedResult = await updateQuizResult(editResultData);
        setQuizResults((prev) =>
          prev.map((result) =>
            result.id === updatedResult.id ? updatedResult : result
          )
        );
        setEditingResult(null);
        setEditResultData(null);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setMutationLoading(false);
      }
    }
  };

  // Thêm hàm xử lý chỉnh sửa quiz
  const editQuiz = (quizId: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setEditingQuizId(quizId);
      setEditQuizData({ ...quiz });
    }
  };

  // Thêm hàm xử lý lưu quiz
  const saveQuiz = async () => {
    if (!editQuizData) return;
    try {
      setMutationLoading(true);
      if (creatingQuiz) {
        const newQuiz = await createNewQuiz({ name: editQuizData.name });
        if (!newQuiz.id) throw new Error("Không nhận được ID từ quiz mới tạo");
  
        // Chuẩn hóa newQuiz
        const normalizedNewQuiz = {
          ...newQuiz,
          questions: newQuiz.questions || [], // Đảm bảo questions là mảng
        };
  
        setQuizzes((prev) => [...prev, normalizedNewQuiz]);
        setSelectedQuizId(normalizedNewQuiz.id); // Tùy chọn
        setCreatingQuiz(false);
      } else if (editingQuizId) {
        const updatedQuiz = await updateQuiz(editQuizData);
        setQuizzes((prev) =>
          prev.map((q) => (q.id === updatedQuiz.id ? { ...updatedQuiz, questions: updatedQuiz.questions || [] } : q))
        );
        setEditingQuizId(null);
      }
      setEditQuizData(null);
    } catch (err) {
      setError(handleApiError(err));
      console.error("Lỗi khi lưu quiz:", err);
    } finally {
      setMutationLoading(false);
    }
  };

  // Thêm hàm xử lý xóa quiz
  const handleDeleteQuiz = async (quizId: number) => {
    try {
      setMutationLoading(true);
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      if (selectedQuizId === quizId) setSelectedQuizId(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setMutationLoading(false);
    }
  };

  // Thêm hàm xử lý tạo quiz mới
  const handleCreateNewQuiz = () => {
    setCreatingQuiz(true);
    setEditQuizData({
      id: 0,
      name: "",
      categoryId: 0,
      categoryName: "",
      questions: [],
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center text-red-500">
        {error}
        <button
          onClick={() => {
            fetchQuizzesData();
            fetchQuizResultsData();
          }}
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
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Quản Lý Bài Kiểm Tra
          </h1>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "quiz"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Bài Kiểm Tra
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "result"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Kết Quả Bài Kiểm Tra
            </button>
          </div>
          {activeTab === "quiz" && (
            <motion.div
              className="bg-pink-100 shadow-lg rounded-lg p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Danh Sách Bài Kiểm Tra
                </h2>
                <motion.button
                  onClick={handleCreateNewQuiz}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Thêm Quiz Mới
                </motion.button>
              </div>
              {creatingQuiz && editQuizData && (
                <motion.div
                  className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    value={editQuizData.name}
                    onChange={(e) =>
                      setEditQuizData({ ...editQuizData, name: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Tên Quiz"
                  />
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={saveQuiz}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setCreatingQuiz(false)}
                      className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                </motion.div>
              )}
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="mb-6">
                  {editingQuizId === quiz.id && editQuizData ? (
                    <motion.div
                      className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <input
                        type="text"
                        value={editQuizData.name}
                        onChange={(e) =>
                          setEditQuizData({
                            ...editQuizData,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2 mb-2 border rounded"
                        placeholder="Tên Quiz"
                      />
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={saveQuiz}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingQuizId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div
                        onClick={() => toggleQuiz(quiz.id)}
                        className="text-lg font-semibold cursor-pointer flex justify-between items-center bg-white p-3 shadow rounded-lg flex-1"
                      >
                        {quiz.name}
                        <svg
                          className={`w-6 h-6 ml-2 transform transition-transform duration-300 ${
                            selectedQuizId === quiz.id
                              ? "rotate-180"
                              : "rotate-0"
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
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => editQuiz(quiz.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  )}
               {selectedQuizId === quiz.id && (
  <div className="mt-3 space-y-4">
    {mutationLoading ? (
      <div>Đang xử lý...</div>
    ) : (
      <>
        {creatingQuestionForQuiz === quiz.id ? (
          <QuestionEditor
            editData={editQuestionData}
            setEditData={setEditQuestionData}
            saveQuestion={saveQuestion}
            cancelEdit={() => setCreatingQuestionForQuiz(null)}
          />
        ) : (
          <>
            {quiz.questions && quiz.questions.length > 0 ? (
              quiz.questions.map((q, idx) =>
                editingQuestion?.quizId === quiz.id && editingQuestion.index === idx ? (
                  <QuestionEditor
                    key={q.id}
                    editData={editQuestionData}
                    setEditData={setEditQuestionData}
                    saveQuestion={saveQuestion}
                    cancelEdit={() => setEditingQuestion(null)}
                  />
                ) : (
                  <QuestionItem
                    key={q.id}
                    question={q}
                    onEdit={() => editQuestion(quiz.id, idx)}
                    onDelete={() => handleDeleteQuestion(quiz.id, q.id)}
                  />
                )
              )
            ) : (
              <p>Chưa có câu hỏi nào.</p>
            )}
            <motion.button
              onClick={() => handleCreateNewQuestion(quiz.id)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Thêm Câu Hỏi Mới
            </motion.button>
          </>
        )}
      </>
    )}
  </div>
)}
                </div>
              ))}
            </motion.div>
          )}
          {activeTab === "result" && (
            <motion.div
              className="bg-pink-100 shadow-lg rounded-lg p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">
                Danh Sách Kết Quả Có Thể Có
              </h2>
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="mb-6">
                  <div
                    onClick={() => toggleQuiz(quiz.id)}
                    className="text-lg font-semibold cursor-pointer flex justify-between items-center bg-white p-3 shadow rounded-lg"
                  >
                    {quiz.name}
                    <svg
                      className={`w-6 h-6 ml-2 transform transition-transform duration-300 ${
                        selectedQuizId === quiz.id ? "rotate-180" : "rotate-0"
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
                  {selectedQuizId === quiz.id && (
                    <div className="mt-3 space-y-4">
                      {mutationLoading ? (
                        <div>Đang xử lý...</div>
                      ) : (
                        <>
                          {quizResults
                            .filter((result) => result.quizId === quiz.id)
                            .map((result) =>
                              editingResult === result.id ? (
                                <motion.div
                                  key={result.id}
                                  className="bg-gray-50 p-3 rounded-lg shadow-sm"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <p>
                                    <strong>Kết quả:</strong>
                                  </p>
                                  <input
                                    type="text"
                                    value={editResultData?.resultText || ""}
                                    onChange={(e) =>
                                      setEditResultData({
                                        ...editResultData!,
                                        resultText: e.target.value,
                                      })
                                    }
                                    className="w-full p-2 mb-2 border rounded"
                                    placeholder="Kết quả"
                                  />
                                  <p>
                                    <strong>Khoảng Điểm:</strong>
                                  </p>
                                  <p>Điểm Min :</p>
                                  <input
                                    type="number"
                                    value={editResultData?.minPoint || 0}
                                    onChange={(e) =>
                                      setEditResultData({
                                        ...editResultData!,
                                        minPoint: parseInt(e.target.value),
                                      })
                                    }
                                    className="w-full p-2 mb-2 border rounded"
                                    placeholder="Điểm tối thiểu"
                                  />
                                  <p>Điểm Max :</p>
                                  <input
                                    type="number"
                                    value={editResultData?.maxPoint || 0}
                                    onChange={(e) =>
                                      setEditResultData({
                                        ...editResultData!,
                                        maxPoint: parseInt(e.target.value),
                                      })
                                    }
                                    className="w-full p-2 mb-2 border rounded"
                                    placeholder="Điểm tối đa"
                                  />
                                  <div className="flex space-x-2 justify-end">
                                    <button
                                      onClick={saveQuizResult}
                                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      onClick={() => setEditingResult(null)}
                                      className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key={result.id}
                                  className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div>
                                    <p>
                                      <strong>Kết quả:</strong>{" "}
                                      {result.resultText}
                                    </p>
                                    <p>
                                      <strong>Khoảng Điểm:</strong>
                                    </p>
                                    <p>Điểm Min : {result.minPoint}</p>
                                    <p>Điểm Max : {result.maxPoint}</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => editQuizResult(result.id)}
                                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteQuizResult(result.id)
                                      }
                                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </motion.div>
                              )
                            )}
                          {quizResults.filter(
                            (result) => result.quizId === quiz.id
                          ).length === 0 && (
                            <p className="text-gray-500">
                              Không có kết quả nào cho quiz này.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
