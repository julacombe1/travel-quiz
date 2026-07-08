import { createContext, useContext, useState } from "react";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [answers, setAnswers] = useState({});

  const setAnswer = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <QuizContext.Provider value={{ answers, setAnswer }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}