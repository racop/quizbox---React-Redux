import { List, Modal, Progress } from "antd";
import React from "react";
import { useQuizBox } from "../../hooks/useQuizBox";
import { empty } from "../../utils/common";
import { Colors, CORRECT, INCORRECT, TIMEOUT } from "../../utils/constants";

const QuizResultModal = (props) => {
  const { isModalOpen, handleClose, questions, score } = props;
  const { getCorrectAnswer, getOperator } = useQuizBox();

  const pullAnswers = (q) => {
    let remarks = INCORRECT;
    const correctAns = Math.round(getCorrectAnswer(q.x, q.y, q.operator));
    if (q.answer.timeCounter === 0 && q.answer.answer === "") {
      // Timed out
      remarks = TIMEOUT;
    } else if (parseFloat(q.answer.answer) !== parseFloat(correctAns)) {
      // Answer is wrong
      remarks = INCORRECT;
    } else {
      // Answer is correct
      remarks = CORRECT;
    }
    return {
      correctAnswer: correctAns,
      remarks,
    };
  };

  const getStatusIcons = (key) => {
    switch (key) {
      case INCORRECT:
        return "❌";
      case TIMEOUT:
        return "⚠️";
      default:
        return "✅";
    }
  };
  const getStatusClasses = (item) => {
    switch (item.answer.remarks) {
      case INCORRECT:
        return "red-text";
      case TIMEOUT:
        return "yellow-text";
      default:
        return "green-text";
    }
  };

  const getStatusStroke = (questions) => {
    const strokes = [];
    questions.map((question) => {
      switch (question.answer.remarks) {
        case INCORRECT:
          strokes.push(Colors.themeRed);
          break;
        case TIMEOUT:
          strokes.push(Colors.themeYellow);
          break;
        default:
          strokes.push(Colors.themeGreen);
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
      </>
    </Modal>
  );
};

export default QuizResultModal;
