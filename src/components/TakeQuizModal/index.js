import { Form, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuizBox } from "../../hooks/useQuizBox";
import { addQuizAnswer, updateQuizStatus } from "../../redux/slices/quizBox.slice";
import { empty } from "../../utils/common";
import AnswerStatus from "../AnswerStatus";
import CustomButton from "../CustomButton";
import QuizBoxField from "../QuizBoxField";
import QuizResultModal from "../QuizResultModal";
import "./takeQuizModal.css";

/*
  Open A Quiz modal, where show one question per page with timer on it
  input field should get disabled once timer is over
*/

const TakeQuizModal = (props) => {
  const { timer, handleClose, isModalOpen, questions, id, score, questionIndex } = props;
  const [activeQid, setActiveQid] = useState({});
  const [errors, setErrors] = useState({});
  const { getOperator, getCorrectAnswer } = useQuizBox();
  const [currentAnswer, setCurrentAnswer] = useState("");
  const dispatch = useDispatch();
  const [timeCounter, setTimeCounter] = useState(timer);
  const [timeoutId, setTimeoutId] = useState();
  const [quizMode, setQuizMode] = useState(0);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const quizModeRef = useRef(0); // Use to stop timer on next

  const [form] = Form.useForm();

  useEffect(() => {
    setActiveQid({ index: questionIndex, id: questions[questionIndex].id });
    runTimeCounter(timeCounter);
    return () => {
      // setquizQuestions([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeCounter <= 0) {
      // Auto submit question
      handleQuestionSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeCounter]);

  const runTimeCounter = (tc) => {
    if (timeoutId) clearTimeout(timeoutId); // Clear timeout Id
    const tId = setTimeout(() => {
      if (tc > 0 && quizModeRef.current === 0) {
        setTimeCounter(tc - 1);
        runTimeCounter(tc - 1);
      }
    }, 1000);
    setTimeoutId(tId);
  };
  const updateErrors = (key, msg) => {
    if (!empty(msg)) setErrors((prev) => ({ ...prev, [key]: msg }));
    else {
      setErrors((prev) => {
        const _errors = { ...prev };
        delete _errors[key];
        return _errors;
      });
    }
  };

  const evaluateQuestion = () => {
    let remarks = "Wrong";
    let score = 0;
    const correctAns = getCorrectAnswer(
      questions[activeQid.index].x,
      questions[activeQid.index].y,
      questions[activeQid.index].operator
    );
    if (timeCounter === 0 && currentAnswer === "") {
      // Timed out
      remarks = "timeout";
    } else if (Math.round(currentAnswer) !== Math.round(correctAns)) {
      // Answer is wrong
      remarks = "incorrect";
    } else {
      // Answer is correct
      score = 1;
      remarks = "correct";
    }
    return {
      correctAnswer: correctAns,
      remarks,
      score,
    };
  };

  const handleQuestionSubmit = () => {
    // Set mode to 1 to enable preview for current input
    quizModeRef.current = 1;
    setQuizMode(1); // Enable preview winodw, disable input window
    const response = { id: activeQid.id, answer: currentAnswer };
    const { remarks, score } = evaluateQuestion();
    response.remarks = remarks;
    response.timeCounter = timeCounter;
    dispatch(
      addQuizAnswer({
        quizId: id,
        questionId: activeQid.id,
        answer: response,
        score: score,
      })
    );
    if (questions.length === activeQid.index + 1) {
      dispatch(updateQuizStatus({ quizId: id, status: "completed" }));
    }
  };

  const continueToNext = () => {
    quizModeRef.current = 0; // Reset mode to 0
    if (questions.length === activeQid.index + 1) {
      // Reached final question, launch preview
      setQuizMode(2); // Enable preview
      setIsResultModalOpen(true); // Open Result Preview Modal
      return;
    } else {
      setQuizMode(0);
    }
    setActiveQid({
      index: activeQid.index + 1,
      id: questions[activeQid.index + 1].id,
    });
    setTimeCounter(timer);
    runTimeCounter(timer);
    setCurrentAnswer(""); // Reset input field
  };

  const handleChange = (key, v) => {
    setCurrentAnswer(v);
    if (empty(v)) {
      updateErrors(key, "Answer can not be empty!");
    } else if (!v.match(/^[0-9]+$/)) {
      updateErrors(key, "Input should only be numbers");
    }
  };

  const isSubmitDisabled = empty(currentAnswer) || Object.keys(errors).length > 0;

  const closeResultModal = () => {
    setIsResultModalOpen(false);
    handleClose(); // Close take Quiz modal
  };

  const getLabel = (question) => {
    return `${question.x} ${getOperator(question.operator)} ${question.y} = ?`;
  };
  return (
    <>
      {!isResultModalOpen && (
        <Modal
          title={`Question ${activeQid?.index ? activeQid.index + 1 : 1}`}
          open={isModalOpen}
          onCancel={handleClose}
          footer={[]}
        >
          <Form form={form} id="quizbox">
            {questions && questions[activeQid.index] && quizMode === 0 && (
              <>
                <div className="input-timer">{`${timeCounter} second${timeCounter > 1 ? "s" : ""} left`}</div>
                <div className="field-block">
                  <QuizBoxField
                    name={"answer"}
                    labelClass="input-answer"
                    label={getLabel(questions[activeQid.index])}
                    type={"text"}
                    placeholder={"Input answer"}
                    onChange={(v) => handleChange("answer", v)}
                  />
                  {errors["answer"] && <span className="error-txt">{errors["answer"]}</span>}
                </div>
                <div className="input-submit">
                  <CustomButton disabled={isSubmitDisabled} onClick={handleQuestionSubmit}>
                    Next
                  </CustomButton>
                </div>
              </>
            )}

            {questions && questions[activeQid.index] && quizMode === 1 && (
              <>
                <label className="input-answer">{getLabel(questions[activeQid.index])}</label>
                {!empty(currentAnswer) && (
                  <div className="input-response">
                    <span>Your response:</span> {currentAnswer}
                  </div>
                )}
                <AnswerStatus type={evaluateQuestion().remarks} />
                <div className="input-submit">
                  <CustomButton onClick={continueToNext}>Continue</CustomButton>
                </div>
              </>
            )}
          </Form>
        </Modal>
      )}

      {isResultModalOpen && (
        <QuizResultModal
          isModalOpen={isResultModalOpen}
          handleClose={closeResultModal}
          questions={questions}
          score={score}
        />
      )}
    </>
  );
};

export default TakeQuizModal;
