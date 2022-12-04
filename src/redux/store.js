import { configureStore } from "@reduxjs/toolkit";
import { quizBoxReducer } from "./slices/quizBox.slice";

export const store = configureStore({
  reducer: quizBoxReducer,
});
