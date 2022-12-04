import { List, Modal, Progress } from "antd";
import React from "react";
import { useQuizBox } from "../../hooks/useQuizBox";
import { empty } from "../../utils/common";

const QuizResultModal = (props) => {
  const { isModalOpen, handleClose, questions, score } = props;
  const { getCorrectAnswer, getOperator } = useQuizBox();

  const pullAnswers = (q) => {
    let remarks = "Wrong";
    const correctAns = getCorrectAnswer(q.x, q.y, q.operator);
    console.log("q.answer.answer ", q.answer.answer, correctAns);
    if (q.answer.timeCounter === 0 && q.answer.answer === "") {
      // Timed out
      remarks = "timeout";
    } else if (parseFloat(q.answer.answer) !== parseFloat(correctAns)) {
      // Answer is wrong
      remarks = "incorrect";
    } else {
      console.log("wrong ", parseFloat(q.answer.answer), parseFloat(correctAns));
      // Answer is correct
      remarks = "correct";
    }
    return {
      correctAnswer: correctAns,
      remarks,
    };
  };

  const getStatusIcons = (key) => {
    switch (key) {
      case "incorrect":
        return "❌";
      case "timeout":
        return "⚠️";
      default:
        return "✅";
    }
  };
  const getStatusClasses = (item) => {
    switch (item.answer.remarks) {
      case "incorrect":
        return "red-text";
      case "timeout":
        return "yellow-text";
      default:
        return "green-text";
    }
  };

  const getStatusStroke = (questions) => {
    const strokes = [];
    questions.map((question) => {
      switch (question.answer.remarks) {
        case "incorrect":
          strokes.push("#fa4873");
          break;
        case "timeout":
          strokes.push("#ffba47");
          break;
        default:
          strokes.push("#1fd77c");
          break;
      }
      return question;
    });
    return strokes;
  };

  return (
    <Modal title={`Result`} open={isModalOpen} onCancel={handleClose} footer={[]}>
      <>
        <List
          itemLayout="horizontal"
          dataSource={questions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<span style={{ fontSize: "18px" }}>{getStatusIcons(item?.answer?.remarks)}</span>}
                title={
                  <span className={getStatusClasses(item)}>
                    {`${item.x} ${getOperator(item.operator)} ${item.y} = ${
                      empty(item.answer?.answer) ? "__" : item.answer?.answer
                    } ${item.answer?.remarks === "timeout" ? "(Timed out)" : ""}`}
                  </span>
                }
                description={
                  <span style={{ color: "black" }}>{`Expected answer: ${pullAnswers(item).correctAnswer}`}</span>
                }
              />
            </List.Item>
          )}
        />
        <div className="result-score">
          <Progress percent={100} steps={questions.length} strokeColor={getStatusStroke(questions)} />
          <div style={{ fontSize: "16px", display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontWeight: 600 }}>Your Score:&nbsp;</span>
            {score}/{questions.length}
          </div>
        </div>

        {/* {questions.map((q) => (
          <>
            <label>
              {q.x} {getOperator(q.operator)} {q.y}
            </label>
            <div>Your answer: {q.answer.answer}</div>
            <AnswerStatus type={pullAnswers(q).remarks} />
          </>
        ))} */}
      </>
    </Modal>
  );
};

export default QuizResultModal;
