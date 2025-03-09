import axios from "axios";

export interface QuizOption {
  id: number;
  text: string;
  point: number;
}

export interface Question {
  id: number;
  text: string;
  type: string;
  answers: QuizOption[];
}

export interface Quiz {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  questions: Question[];
}

const quizData = async (): Promise<Quiz[]> => {
  
    const response = await axios.get("/swp/quiz");

    const result = response.data?.result;
    if (response.status === 200 && Array.isArray(result)) {
      return result;
    }

    return [];
 
};

export default quizData;