import { Result } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuizBoxState, updateQuizStatus } from "../../redux/slices/quizBox.slice";
import CustomButton from "../CustomButton";
import QuizResultModal from "../QuizResultModal";
import TakeQuizModal from "../TakeQuizModal";
import "./QuizCard.css";

const QuizCard = ({ quiz, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const dispatch = useDispatch();
  const [qid, setqid] = useState();

  const { id, quizSettings, questions, status, score, newQuestionIndex } = quiz;

  const handleTakeQuizClick = (qid) => {
    setqid(qid);
    setIsModalOpen(true);
    newQuestionIndex === 0 && dispatch(updateQuizStatus({ quizId: qid, status: "started" }));
    console.log(qid, "started");
  };

  const handleShowResultClick = () => {
    setIsResultModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const closeResultModal = () => {
    setIsResultModalOpen(false);
  };

  return (
    <div className="q-card">
      <div className="q-name">Quiz {index + 1}</div>
      <div>Total Questions: {quizSettings.qNumber}</div>
      <div>Timer: {quizSettings.timer}</div>
      <div>
        {status === "not_started" ? (
          <CustomButton variant="primary" onClick={() => handleTakeQuizClick(id)}>
            Take Quiz
          </CustomButton>
        ) : status === "started" ? (
          <CustomButton onClick={() => handleTakeQuizClick(id)}>Resume</CustomButton>
        ) : (
          <CustomButton onClick={() => handleShowResultClick(id)}>Show result</CustomButton>
        )}
      </div>

      {isModalOpen && (
        <TakeQuizModal
          id={qid}
          timer={quizSettings.timer}
          questions={questions}
          isModalOpen={isModalOpen}
          score={score}
          questionIndex={newQuestionIndex}
          handleClose={handleClose}
        />
      )}

      {isResultModalOpen && (
        <QuizResultModal
          questions={questions}
          isModalOpen={isResultModalOpen}
          handleClose={closeResultModal}
          score={score}
        />
      )}
    </div>
  );
};

const QuizCardList = (qData) => {
  const quizBoxState = useSelector(getQuizBoxState);

  if (quizBoxState.length > 0)
    return (
      <div className="quizcard-list">
        {quizBoxState.map((q, ind) => (
          <QuizCard key={q.id} quiz={q} index={ind} />
        ))}
      </div>
    );
  return <Result title="No Quizzes found! Create One 📑" />;
};

export default QuizCardList;
