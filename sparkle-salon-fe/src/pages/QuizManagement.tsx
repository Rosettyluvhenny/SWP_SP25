import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import QuestionEditor from "../components/QuestionEditor";
import QuestionItem from "../components/QuestionItem";
import Sidebar from "../components/SideBarDashboard";
import {
  Answer,
  createNewQuestion,
  createNewQuiz,
  createQuizResult,
  deleteAnswer,
  deleteQuestion,
  deleteQuiz,
  deleteQuizResult,
  fetchQuizResults,
  fetchQuizzes,
  fetchServices,
  handleApiError,
  Question,
  Quiz,
  QuizResult,
  Service,
  updateAnswers,
  updateQuestionText,
  updateQuiz,
  updateQuizResult,
  disableQuiz,
  enableQuiz,
} from "../components/quizApi";
import { Category, CategoryData } from "../data/categoryData.ts";

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
  const [creatingResultForQuiz, setCreatingResultForQuiz] = useState<
    number | null
  >(null);
  const [newResultData, setNewResultData] = useState<Omit<
    QuizResult,
    "id"
  > | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"quiz" | "result">("quiz");
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editQuizData, setEditQuizData] = useState<Quiz | null>(null);
  const [creatingQuiz, setCreatingQuiz] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [categories, setCategories] = useState<Category[]>([]);

  // Hàm lấy dữ liệu quizzes
  const fetchQuizzesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizzesData = await fetchQuizzes();
      const normalizedQuizzes = quizzesData.map((quiz) => ({
        ...quiz,
        questions: quiz.questions || [],
      }));
      setQuizzes(normalizedQuizzes);
      const allAnswers = normalizedQuizzes.flatMap((quiz) =>
        quiz.questions.flatMap((question) => question.answers || [])
      );
      setAnswer(allAnswers);
    } catch (error) {
      setError(handleApiError(error));

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryData();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);
  // Hàm lấy dữ liệu quiz results
  const fetchQuizResultsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultsData = await fetchQuizResults();
      setQuizResults(resultsData);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu services
  const fetchServicesData = async () => {
    try {
      const servicesData = await fetchServices(0, 100);
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (err) {
      console.error("Lỗi khi lấy dịch vụ:", err);
      setError(handleApiError(err));
      setServices([]);
      setFilteredServices([]);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchQuizzesData();
    fetchQuizResultsData();
    fetchServicesData();
  }, []);

  // Lọc dịch vụ khi searchTerm thay đổi
  useEffect(() => {
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  // Chuyển đổi hiển thị quiz
  const toggleQuiz = (quizId: number) =>
    setSelectedQuizId(selectedQuizId === quizId ? null : quizId);

  // Xóa câu hỏi
  const handleDeleteQuestion = async (quizId: number, questionId: number) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa câu hỏi này không?"
    );
    if (!isConfirmed) return Promise.reject("Hủy xóa câu hỏi");
    try {
      setMutationLoading(true);
      const quiz = quizzes.find((q) => q.id === quizId);
      if (!quiz) throw new Error("Không tìm thấy quiz!");
      const question = quiz.questions.find((q) => q.id === questionId);
      if (!question) throw new Error("Không tìm thấy câu hỏi!");
      const answerIds = (question.answers || [])
        .map((a) => a.id)
        .filter((id): id is number => id !== undefined);
      if (answerIds.length > 0) {
      
        await Promise.all(answerIds.map((answerId) => deleteAnswer(answerId)));
       
      }
      await deleteQuestion(questionId);
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
      setAnswer((prev) => prev.filter((a) => !answerIds.includes(a.id)));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Xóa câu hỏi không thành công"
      );     } finally {
      setMutationLoading(false);
    }
  };

  // Chỉnh sửa câu hỏi
  const editQuestion = (quizId: number, index: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setEditingQuestion({ quizId, index });
      setEditQuestionData({ ...quiz.questions[index] });
    }
  };
//kich hoạt và vô hiệu hóa quizquiz
  const handleToggleStatus = async (quiz: Quiz) => {
    const isDisabling = !quiz.status;
    const confirmMessage = isDisabling
      ? "Bạn có chắc chắn muốn kích hoạt quiz này không?"
      : "Bạn có chắc chắn muốn vô hiệu hóa quiz này không?";

    if (!window.confirm(confirmMessage)) return;

    const success = isDisabling
      ? await enableQuiz(quiz.id)
      : await disableQuiz(quiz.id);
console.log(success)
    if (success) {
      toast.success("Đã Thay đổi trạng thái thành công"); 
    }
    fetchQuizzesData();
    setLoading(false);
  };

  // Tạo câu hỏi mới
  const handleCreateNewQuestion = (quizId: number) => {
    setCreatingQuestionForQuiz(quizId);
    setEditQuestionData({
      id: 0,
      text: "",
      type: "multiple-choice",
      answers: [],
    });
  };

  // Lưu câu hỏi
  const saveQuestion = async () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn lưu không?"
    );
    if (!isConfirmed) return Promise.reject("Hủy xóa câu hỏi");
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
        if(newQuestion){
          toast.success("Tạo câu hỏi mới thành công");
        }
        setAnswer((prev) => [...prev, ...updatedAnswers]);
        setCreatingQuestionForQuiz(null);
      } else if (editingQuestion) {
        const quiz = quizzes.find((q) =>
          q.questions.some((qs) => qs.id === editQuestionData.id)
        );
        if (!quiz) throw new Error("Không tìm thấy quiz chứa câu hỏi này!");
        await updateQuestionText(quiz, editQuestionData);
        const updatedAnswers = await updateAnswers(
          editQuestionData,
          editQuestionData.answers
        );
        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz.questions.some((q) => q.id === editQuestionData.id)
              ? {
                  ...quiz,
                  questions: quiz.questions.map((q) =>
                    q.id === editQuestionData.id
                      ? { ...editQuestionData, answers: updatedAnswers }
                      : q
                  ),
                }
              : quiz
          )
        );
        if(updatedAnswers){
          toast.success("Cập nhật câu hỏi thành công");
        }
        setAnswer((prev) =>
          prev
            .filter(
              (a) =>
                !quiz.questions.some(
                  (q) =>
                    q.id === editQuestionData.id &&
                    q.answers.some((ans) => ans.id === a.id)
                )
            )
            .concat(updatedAnswers)
        );
        setEditingQuestion(null);
      }
      setEditQuestionData(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không để trống tên quiz"
      );    } finally {
      setMutationLoading(false);
    }
  };

  // Xóa kết quả bài quiz
  const handleDeleteQuizResult = async (resultId: number) => {
    try {
      setMutationLoading(true);
      await deleteQuizResult(resultId);
      setQuizResults((prev) => prev.filter((result) => result.id !== resultId));
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setMutationLoading(false);
    }
  };

  // Chỉnh sửa kết quả bài quiz
  const editQuizResult = (resultId: number) => {
    const result = quizResults.find((r) => r.id === resultId);
    if (result) {
      setEditingResult(resultId);
      setEditResultData({ ...result });
    }
  };

  // Lưu kết quả bài quiz
  const saveQuizResult = async () => {
    if (!editResultData) return;
    try {
      setMutationLoading(true);
      const updatedResult = await updateQuizResult(editResultData);
      setQuizResults((prev) =>
        prev.map((result) =>
          result.id === updatedResult.id ? updatedResult : result
        )
      );
      if (updatedResult) {
        toast.success("Cập nhật kết quả thành công");
      }
      setEditingResult(null);
      setEditResultData(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Cập nhật kết quả thất bại"
      );    } finally {
      setMutationLoading(false);
    }
  };

  // Tạo kết quả mới
  const handleCreateNewResult = (quizId: number) => {
    setCreatingResultForQuiz(quizId);
    setNewResultData({
      quizId: quizId,
      resultText: "",
      minPoint: 0,
      maxPoint: 0,
      quizName: quizzes.find((q) => q.id === quizId)?.name || "",
      services: [],
    });
  };

  // Lưu kết quả mới
  const saveNewResult = async () => {
    if (!newResultData || !creatingResultForQuiz) return;
    try {
      setMutationLoading(true);
      const createdResult = await createQuizResult(creatingResultForQuiz, {
        resultText: newResultData.resultText,
        minPoint: newResultData.minPoint,
        maxPoint: newResultData.maxPoint,
        quizId: newResultData.quizId,
        quizName: newResultData.quizName,
        services: newResultData.services,
      });
      if (createdResult) {
        toast.success("Tạo kết quả thành công");
      }
      setQuizResults((prev) => [...prev, createdResult]);
      setCreatingResultForQuiz(null);
      setNewResultData(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Tạo kết quả thất bại"
      );
        } finally {
      setMutationLoading(false);
    }
  };

  // Chỉnh sửa bài quiz
  const editQuiz = (quizId: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setEditingQuizId(quizId);
      setEditQuizData({ ...quiz });
      setSelectedCategory(quiz.categoryId.toString());
    }
  };

  // Lưu bài quiz
  const saveQuiz = async () => {
    if (!editQuizData) return;
    try {
      setMutationLoading(true);
      const data = {
        categoryId: editQuizData.categoryId,
        name: editQuizData.name,
      };
      if (creatingQuiz) {
        const newQuiz = await createNewQuiz(data);
        if (!newQuiz.id)
          throw new Error("Không nhận được ID từ bài quiz mới tạo");
        const normalizedNewQuiz = {
          ...newQuiz,
          questions: newQuiz.questions || [],
        };
        if (newQuiz) {
          toast.success("Tạo quiz thành công");
        }
        setQuizzes((prev) => [...prev, normalizedNewQuiz]);
        setSelectedQuizId(normalizedNewQuiz.id);
        setCreatingQuiz(false);
      } else if (editingQuizId) {
        const updatedQuiz = await updateQuiz(editQuizData);
        setQuizzes((prev) =>
          prev.map((q) =>
            q.id === updatedQuiz.id
              ? { ...updatedQuiz, questions: updatedQuiz.questions || [] }
              : q
          )
        );
        if (updatedQuiz) {
          toast.success("Cập nhật quiz thành công");
        }
        setEditingQuizId(null);
      }
      setEditQuizData(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Chưa nhập tên quiz"
      );
    } finally {
      setMutationLoading(false);
    }
  };

  // Xóa bài quiz
  const handleDeleteQuiz = async (quizId: number) => {
    try {
      setMutationLoading(true);
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      if (selectedQuizId === quizId) setSelectedQuizId(null);
      if (quizId) {
        toast.success("Xóa quiz thành công");
      }
    } catch (error) {
toast.error(
        error instanceof Error ? error.message : "Xóa quiz thất bại"
      );    } finally {
      setMutationLoading(false);
    }
  };

  // Tạo bài quiz mới
  const handleCreateNewQuiz = () => {
    setCreatingQuiz(true);
    setEditQuizData({
      id: 0,
      name: "",
      categoryId: Number(selectedCategory),
      categoryName: "",
      questions: [],
      status: false,
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        Đang tải dữ liệu...
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
            fetchServicesData();
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
              Kết Quả
            </button>
          </div>

          {/* Tab Bài Kiểm Tra */}
          {activeTab === "quiz" && (
            <motion.div
              className="bg-pink-100 shadow-lg rounded-lg p-6 max-h-[80vh] overflow-y-auto"
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
                  + Thêm Bài Kiểm Tra Mới
                </motion.button>
              </div>

              {creatingQuiz && editQuizData && (
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow-sm mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                      {/* Quiz name input */}
                      <div className="flex flex-col  w-full md:w-4/5 relative">
                        <label className="pr-2 mb-2 font-medium text-gray-700">
                          Quiz Name
                        </label>
                        <input
                          type="text"
                          value={editQuizData.name}
                          onChange={(e) =>
                            setEditQuizData({
                              ...editQuizData,
                              name: e.target.value,
                            })
                          }
                          className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-12"
                          placeholder="Nhập tên quiz"
                        />
                      </div>

                      {/* Category select */}
                      <div className="flex flex-col  w-1/5">
                        <label className="pr-2 mb-2 font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-12"
                        >
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <option
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </option>
                            ))
                          ) : (
                            <option value="0" disabled>
                              Không có category nào
                            </option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={saveQuiz}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 font-medium"
                      >
                        Tạo
                      </button>
                      <button
                        onClick={() => setCreatingQuiz(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 font-medium"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="mb-6">
                    {editingQuizId === quiz.id && editQuizData ? (
                      <motion.div
                        className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">

                        <div className="flex flex-col  w-full md:w-4/5 relative">
                        <label className="pr-2 mb-2 font-medium text-gray-700">
                          Quiz Name
                        </label>
                        <input
                          type="text"
                          value={editQuizData.name}
                          onChange={(e) =>
                            setEditQuizData({
                              ...editQuizData,
                              name: e.target.value,
                            })
                          }
                          className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-12"
                          placeholder="Tên bài kiểm tra"
                        />
                        </div>
                        <div className="flex flex-col  w-1/5">
                        <label className="pr-2 mb-2 font-medium text-gray-700">
                          Category
                        </label>
                          <select
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                              setEditQuizData({
                                ...editQuizData,
                                categoryId: Number(e.target.value),
                              });
                            }}
                            className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-12"
                          >
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <option
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </option>
                              ))
                            ) : (
                              <option value="0" disabled>
                                Không có category nào
                              </option>
                            )}
                          </select>
                        </div></div>
                        <div className="flex space-x-2 justify-end mt-2">
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

                          <p className="px-2 text-sm flex  flex-1 opacity-40">
                            ({quiz.categoryName})
                          </p>
                          

                          <p className="text-sm flex justify-end items-center flex-1 opacity-40">
                            {quiz.questions.length} câu hỏi
                          </p>
                          
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
                            onClick={() => handleToggleStatus(quiz)}
                            className={`${
                              quiz.status
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                            } text-white px-3 py-1 rounded-lg flex items-center gap-1`}
                          >
                            {quiz.status ? "Vô Hiệu Hóa" : "Kích Hoạt"}
                          </button>
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
                      <div className="mt-3 space-y-4 max-h-[50vh] overflow-y-auto">
                        {mutationLoading ? (
                          <div>Đang xử lý...</div>
                        ) : (
                          <>
                            {creatingQuestionForQuiz === quiz.id ? (
                              <QuestionEditor
                                editData={editQuestionData}
                                setEditData={setEditQuestionData}
                                saveQuestion={saveQuestion}
                                cancelEdit={() =>
                                  setCreatingQuestionForQuiz(null)
                                }
                              />
                            ) : (
                              <>
                                <h3 className="text-lg font-semibold">
                                  Danh sách câu hỏi
                                </h3>
                                {quiz.questions && quiz.questions.length > 0 ? (
                                  quiz.questions.map((q, idx) =>
                                    editingQuestion?.quizId === quiz.id &&
                                    editingQuestion.index === idx ? (
                                      <QuestionEditor
                                        key={q.id}
                                        editData={editQuestionData}
                                        setEditData={setEditQuestionData}
                                        saveQuestion={saveQuestion}
                                        cancelEdit={() =>
                                          setEditingQuestion(null)
                                        }
                                       
                                      />
                                    ) : (
                                      
                                      <QuestionItem
                                        key={q.id}
                                        question={q}
                                        onEdit={() =>
                                          editQuestion(quiz.id, idx)
                                        }
                                        onDelete={() =>
                                          handleDeleteQuestion(quiz.id, q.id)
                                        }
                                      />
                                    )
                                  )
                                ) : (
                                  <p>Chưa có câu hỏi nào.</p>
                                )}
                                <motion.button
                                  onClick={() =>
                                    handleCreateNewQuestion(quiz.id)
                                  }
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
              </div>
            </motion.div>
          )}

          {/* Tab Kết Quả */}
          {activeTab === "result" && (
            <motion.div
              className="bg-pink-100 shadow-lg rounded-lg p-6 max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Danh Sách Kết Quả</h2>

              <div className="space-y-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="mb-6">
                    <div
                      onClick={() => toggleQuiz(quiz.id)}
                      className="text-lg font-semibold cursor-pointer flex justify-between items-center bg-white p-3 shadow rounded-lg flex-1"
                    >
                      {quiz.name}
                      <p className="px-2 text-sm flex  flex-1 opacity-40">
                            ({quiz.categoryName})
                          </p>
                         
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
                      <div className="mt-3 space-y-4 max-h-[80vh] overflow-y-auto">
                        {mutationLoading ? (
                          <div>Đang xử lý...</div>
                        ) : (
                          <>
                            {creatingResultForQuiz === quiz.id &&
                            newResultData ? (
                              <motion.div
                                className="bg-gray-50 p-3 rounded-lg shadow-sm mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <input
                                  type="text"
                                  value={newResultData.resultText}
                                  onChange={(e) =>
                                    setNewResultData({
                                      ...newResultData,
                                      resultText: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 mb-2 border rounded"
                                  placeholder="Kết quả"
                                />
                                <p>Điểm Min:</p>
                                <input
                                  type="number"
                                  value={newResultData.minPoint}
                                  onChange={(e) =>
                                    setNewResultData({
                                      ...newResultData,
                                      minPoint: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full p-2 mb-2 border rounded"
                                  placeholder="Điểm tối thiểu"
                                />
                                <p>Điểm Max:</p>
                                <input
                                  type="number"
                                  value={newResultData.maxPoint}
                                  onChange={(e) =>
                                    setNewResultData({
                                      ...newResultData,
                                      maxPoint: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full p-2 mb-2 border rounded"
                                  placeholder="Điểm tối đa"
                                />
                                <p>
                                  <strong>Dịch vụ đã chọn:</strong>
                                </p>
                                {newResultData.services.length > 0 ? (
                                  <ul className="list-disc pl-5 mb-2">
                                    {newResultData.services.map((service) => (
                                      <li
                                        key={service.id}
                                        className="flex justify-between items-center"
                                      >
                                        {service.name}
                                        <button
                                          onClick={() =>
                                            setNewResultData({
                                              ...newResultData,
                                              services:
                                                newResultData.services.filter(
                                                  (s) => s.id !== service.id
                                                ),
                                            })
                                          }
                                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 ml-2"
                                        >
                                          Xóa
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mb-2">
                                    Chưa có dịch vụ nào được thêm.
                                  </p>
                                )}
                                <p>
                                  <strong>Tìm kiếm và chọn dịch vụ:</strong>
                                </p>
                                <input
                                  type="text"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className="w-full p-2 mb-2 border rounded"
                                  placeholder="Nhập tên dịch vụ để tìm kiếm"
                                />
                                {filteredServices.length > 0 ? (
                                  <ul className="list-disc pl-5 mb-2 max-h-40 overflow-y-auto">
                                    {filteredServices.map((service) => (
                                      <li
                                        key={service.id}
                                        onClick={() => {
                                          if (
                                            !newResultData.services.some(
                                              (s) => s.id === service.id
                                            )
                                          ) {
                                            setNewResultData({
                                              ...newResultData,
                                              services: [
                                                ...newResultData.services,
                                                service,
                                              ],
                                            });
                                          }
                                        }}
                                        className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${
                                          newResultData.services.some(
                                            (s) => s.id === service.id
                                          )
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-black"
                                        }`}
                                      >
                                        {service.name}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mb-2">
                                    Không tìm thấy dịch vụ nào.
                                  </p>
                                )}
                                <div className="flex space-x-2 justify-end">
                                  <button
                                    onClick={saveNewResult}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() =>
                                      setCreatingResultForQuiz(null)
                                    }
                                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </motion.div>
                            ) : (
                              <>
                                <h3 className="text-lg font-semibold">
                                  Danh sách kết quả
                                </h3>
                                {quizResults
                                  .filter((result) => result.quizId === quiz.id)
                                  .map((result) =>
                                    editingResult === result.id &&
                                    editResultData ? (
                                      <motion.div
                                        key={result.id}
                                        className="bg-gray-50 p-3 rounded-lg shadow-sm mt-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <input
                                          type="text"
                                          value={
                                            editResultData.resultText || ""
                                          }
                                          onChange={(e) =>
                                            setEditResultData({
                                              ...editResultData,
                                              resultText: e.target.value,
                                            })
                                          }
                                          className="w-full p-2 mb-2 border rounded"
                                          placeholder="Kết quả"
                                        />
                                        <p>Điểm Min:</p>
                                        <input
                                          type="number"
                                          value={editResultData.minPoint || 0}
                                          onChange={(e) =>
                                            setEditResultData({
                                              ...editResultData,
                                              minPoint:
                                                parseInt(e.target.value) || 0,
                                            })
                                          }
                                          className="w-full p-2 mb-2 border rounded"
                                          placeholder="Điểm tối thiểu"
                                        />
                                        <p>Điểm Max:</p>
                                        <input
                                          type="number"
                                          value={editResultData.maxPoint || 0}
                                          onChange={(e) =>
                                            setEditResultData({
                                              ...editResultData,
                                              maxPoint:
                                                parseInt(e.target.value) || 0,
                                            })
                                          }
                                          className="w-full p-2 mb-2 border rounded"
                                          placeholder="Điểm tối đa"
                                        />
                                        <p>
                                          <strong>Dịch vụ đã chọn:</strong>
                                        </p>
                                        {editResultData.services.length > 0 ? (
                                          <ul className="list-disc pl-5 mb-2">
                                            {editResultData.services.map(
                                              (service) => (
                                                <li
                                                  key={service.id}
                                                  className="flex justify-between items-center"
                                                >
                                                  {service.name}
                                                  <button
                                                    onClick={() =>
                                                      setEditResultData({
                                                        ...editResultData,
                                                        services:
                                                          editResultData.services.filter(
                                                            (s) =>
                                                              s.id !==
                                                              service.id
                                                          ),
                                                      })
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                  >
                                                    ✕
                                                  </button>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <p className="mb-2">
                                            Chưa có dịch vụ nào được thêm.
                                          </p>
                                        )}
                                        <p>
                                          <strong>
                                            Tìm kiếm và chọn dịch vụ:
                                          </strong>
                                        </p>
                                        <input
                                          type="text"
                                          value={searchTerm}
                                          onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                          }
                                          className="w-full p-2 mb-2 border rounded"
                                          placeholder="Nhập tên dịch vụ để tìm kiếm"
                                        />
                                        {filteredServices.length > 0 ? (
                                          <ul className="list-disc pl-5 mb-2 max-h-40 overflow-y-auto">
                                            {filteredServices.map((service) => (
                                              <li
                                                key={service.id}
                                                onClick={() => {
                                                  if (
                                                    !editResultData.services.some(
                                                      (s) => s.id === service.id
                                                    )
                                                  ) {
                                                    setEditResultData({
                                                      ...editResultData,
                                                      services: [
                                                        ...editResultData.services,
                                                        service,
                                                      ],
                                                    });
                                                  }
                                                }}
                                                className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${
                                                  editResultData.services.some(
                                                    (s) => s.id === service.id
                                                  )
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-black"
                                                }`}
                                              >
                                                {service.name}
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="mb-2">
                                            Không tìm thấy dịch vụ nào.
                                          </p>
                                        )}
                                        <div className="flex space-x-2 justify-end">
                                          <button
                                            onClick={saveQuizResult}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                          >
                                            Lưu
                                          </button>
                                          <button
                                            onClick={() =>
                                              setEditingResult(null)
                                            }
                                            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                          >
                                            Hủy
                                          </button>
                                        </div>
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key={result.id}
                                        className="bg-gray-50 p-3 rounded-lg shadow-sm mt-2 flex justify-between items-center"
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
                                          <p>Điểm Min: {result.minPoint}</p>
                                          <p>Điểm Max: {result.maxPoint}</p>
                                          <p>
                                            <strong>Dịch vụ:</strong>{" "}
                                            {result.services.length > 0
                                              ? result.services
                                                  .map((s) => s.name)
                                                  .join(", ")
                                              : "Chưa có dịch vụ"}
                                          </p>
                                        </div>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              editQuizResult(result.id)
                                            }
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
                                  <p className="text-gray-500 mt-2">
                                    Chưa có kết quả nào.
                                  </p>
                                )}
                                <motion.button
                                  onClick={() => handleCreateNewResult(quiz.id)}
                                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  + Thêm Kết Quả Mới
                                </motion.button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <p className="text-gray-500 mt-2">
                    Chưa có bài kiểm tra nào.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
