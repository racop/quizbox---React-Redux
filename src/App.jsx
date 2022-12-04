import React from "react";
import "./App.css";
import AppHeader from "./components/Header";
import QuizCardList from "./components/QuizCardList";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <div className="App-body">
        <QuizCardList />
      </div>
    </div>
  );
}

export default App;
