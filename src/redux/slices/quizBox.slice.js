import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  allQuizzes: [],
};

const getRandomNumber = (min, max) =>
  parseInt(Math.random() * (max - min) + min);

const generateQuestions = (data) => {
  const { min, max, timer, operator, qNumber } = data;
  const questions = [];
  for (let i = 0; i < qNumber; i++) {
    const question = {
      id: nanoid(),
      x: getRandomNumber(min, max),
      y: getRandomNumber(min, max),
      timer,
      operator: operator[Math.floor(Math.random() * operator.length)],
    };
    questions.push(question);
  }
  return questions;
};

export const quizBoxSlice = createSlice({
  name: "QuizBoxSlice",
  initialState,
  reducers: {
    addNewQuiz: (state, { payload }) => {
      const questions = generateQuestions(payload);
      state.allQuizzes = [
        ...state.allQuizzes,
        {
          id: nanoid(),
          quizSettings: payload,
          questions,
          status: "not_started",
          score: 0,
          newQuestionIndex: 0,
        },
      ];
    },
    updateQuizStatus: (state, { payload }) => {
      const { quizId, status } = payload;
      const quizIndex = state.allQuizzes.findIndex((q) => q.id === quizId);
      if (quizIndex === -1) {
        return state;
      }
      state.allQuizzes[quizIndex].status = status;
    },
    addQuizAnswer: (state, { payload }) => {
      const { quizId, questionId, answer, score } = payload;
      const quizIndex = state.allQuizzes.findIndex((q) => q.id === quizId);
      if (quizIndex === -1) {
        return state;
      }
      const questionIndex = state.allQuizzes[quizIndex].questions.findIndex(
        (q) => q.id === questionId
      );
      if (questionIndex === -1) {
        return state;
      }
      state.allQuizzes[quizIndex].questions[questionIndex].answer = answer;
      state.allQuizzes[quizIndex].score += parseInt(score);
      state.allQuizzes[quizIndex].newQuestionIndex = questionIndex + 1;
    },
  },
});

export const quizBoxReducer = quizBoxSlice.reducer;

// Export actions
export const { addNewQuiz, addQuizAnswer, updateQuizStatus } =
  quizBoxSlice.actions;

// Export selector
export const getQuizBoxState = (state) => state.allQuizzes;
