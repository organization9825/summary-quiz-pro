import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface QuizData {
  questions: Question[];
  summary?: string;
}

export interface UserAnswers {
  [questionId: number]: number;
}

interface QuizContextType {
  quizData: QuizData | null;
  setQuizData: (data: QuizData) => void;
  userAnswers: UserAnswers;
  setUserAnswers: (answers: UserAnswers) => void;
  summary: string;
  setSummary: (summary: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetQuiz = () => {
    setQuizData(null);
    setUserAnswers({});
    setSummary('');
    setIsLoading(false);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        setQuizData,
        userAnswers,
        setUserAnswers,
        summary,
        setSummary,
        isLoading,
        setIsLoading,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};