import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import { fetchQuizzes, updateQuestionText, deleteQuestion, handleApiError, Quiz, Question } from "../components/quizApi";
import { Link } from "react-router-dom";
import QuestionItem from "../components/QuestionItem";
import QuestionEditor from "../components/QuestionEditor";

export default function QuizManagement() {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editing, setEditing] = useState<{ quizId: number; index: number } | null>(null);
  const [editData, setEditData] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizzesData = await fetchQuizzes();
      setQuizzes(quizzesData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesData();
  }, []);

  const toggleQuiz = (quizId: number) =>
    setSelectedQuizId(selectedQuizId === quizId ? null : quizId);

  const handleDeleteQuestion = async (quizId: number, questionId: number) => {
    try {
      setMutationLoading(true);
      await deleteQuestion(questionId);
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quizId
            ? { ...q, questions: q.questions.filter((q) => q.id !== questionId) }
            : q
        )
      );
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const editQuestion = (quizId: number, index: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setEditing({ quizId, index });
      setEditData({ ...quiz.questions[index] });
    }
  };

  const saveQuestion = async () => {
    if (editing && editData) {
      try {
        setMutationLoading(true);
  
        // Cập nhật nội dung câu hỏi
        await updateQuestionText(editData);
  
        //await updateAnswers(editData);
  
        // Cập nhật state trong UI
        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz.questions.some((q) => q.id === editData.id)
              ? {
                  ...quiz,
                  questions: quiz.questions.map((q) =>
                    q.id === editData.id ? editData : q
                  ),
                }
              : quiz
          )
        );
  
        // Reset trạng thái chỉnh sửa
        setEditing(null);
        setEditData(null);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setMutationLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Bài Kiểm Tra</h1>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
            <Link to="/manager/createrquiz">+ Thêm Bài Kiểm Tra</Link>
          </button>
        </div>

        <div className="bg-pink-100 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh Sách Bài Kiểm Tra</h2>

          {quizzes.map((quiz) => (
            <div key={quiz.id} className="mb-6">
              <div
                onClick={() => toggleQuiz(quiz.id)}
                className="text-lg font-semibold cursor-pointer flex justify-between items-center bg-white p-3 shadow rounded-lg"
              >
                {quiz.name}
              </div>

              {selectedQuizId === quiz.id && (
                <div className="mt-3 space-y-4">
                  {mutationLoading ? (
                    <div>Đang xử lý...</div>
                  ) : (
                    quiz.questions.map((q, idx) =>
                      editing?.quizId === quiz.id && editing.index === idx ? (
                        <QuestionEditor
                          key={q.id}
                          editData={editData}
                          setEditData={setEditData}
                          saveQuestion={saveQuestion}
                          cancelEdit={() => setEditing(null)}
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