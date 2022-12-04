import React from "react";
import "./answerStatus.css";

const GetStatus = ({ type }) => {
  switch (type) {
    case "correct":
      return <span className="correct">✅ Correct answer</span>;
    case "timeout":
      return <span className="timeout">⚠️ Timed out</span>;
    default:
      return <span className="incorrect">❌ Wrong answer</span>;
  }
};

const AnswerStatus = ({ type }) => {
  return (
    <div className="q-remarks">
      <GetStatus type={type} />
    </div>
  );
};

export default AnswerStatus;
