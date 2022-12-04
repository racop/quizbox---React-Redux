import { Form, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewQuiz } from "../../redux/slices/quizBox.slice";
import { empty } from "../../utils/common";
import CustomButton from "../CustomButton";
import QuizBoxField from "../QuizBoxField";
import "./createQuizModal.css";
import { formSchema } from "./formSchema";

const CreateQuizModal = (props) => {
  const [quizMaker, setQuizMaker] = useState({});
  const [errors, setErrors] = useState({});

  const { isModalOpen, handleClose } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const updateErrors = (keys, msg) => {
    if (typeof keys === "object" && keys.length > 0) {
      if (!empty(msg)) {
        keys.map((key) => setErrors((prev) => ({ ...prev, [key]: msg })));
      } else {
        setErrors((prev) => {
          const _errors = { ...prev };
          keys.map((key) => delete _errors[key]);
          return _errors;
        });
      }
    } else {
      if (!empty(msg)) setErrors((prev) => ({ ...prev, [keys]: msg }));
      else {
        setErrors((prev) => {
          const _errors = { ...prev };
          delete _errors[keys];
          return _errors;
        });
      }
    }
  };

  const evaluateErrors = (key, value) => {
    switch (key) {
      case "min":
        if (empty(value)) {
          updateErrors(key, "Mininmum number cannot be empty");
        } else if (quizMaker["max"] && value > quizMaker["max"]) {
          updateErrors(key, "Mininmum number cannot be greater than maximum number");
        } else {
          updateErrors(["max", "min"]);
        }
        break;
      case "max":
        if (empty(value)) {
          updateErrors(key, "Maximum number cannot be empty");
        } else if (quizMaker["min"] && value < quizMaker["min"]) {
          updateErrors(key, "Maximum number cannot be less than minimum number");
        } else {
          updateErrors(["max", "min"]);
        }
        break;
      case "qNumber":
        if (empty(value)) updateErrors(key, "Number of Questions cannot be empty");
        else updateErrors("qNumber");
        break;
      case "timer":
        if (empty(value)) updateErrors(key, "Timer cannot be empty");
        else updateErrors("timer");
        break;
      case "operator":
        if (empty(value)) updateErrors(key, "Operator cannot be empty");
        else updateErrors("operator");
        break;
      default:
        break;
    }
  };
  const handleChange = (key, value) => {
    setQuizMaker({ ...quizMaker, [key]: value });
    evaluateErrors(key, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check errors on submit
    dispatch(addNewQuiz(quizMaker));
    handleClose();
  };

  const isSubmitDisabled =
    empty(quizMaker.min) ||
    empty(quizMaker.max) ||
    empty(quizMaker.operator) ||
    empty(quizMaker.timer) ||
    empty(quizMaker.qNumber) ||
    Object.keys(errors).length > 0;

  return (
    <Modal title="Add new quiz" open={isModalOpen} onCancel={handleClose} footer={[]}>
      <Form form={form} onSubmitCapture={handleSubmit} id="quizbox">
        {formSchema.map((f, index) => (
          <div className="field-block">
            <QuizBoxField
              key={index}
              name={f.name}
              label={f.label}
              options={f.options}
              type={f.type}
              placeholder={f.placeholder}
              onChange={(v) => handleChange(f.name, v)}
              min={f.min}
              max={f.max}
              addonAfter={f.addonAfter}
              value={quizMaker[f.name]}
            />
            {errors[f.name] && <span className="error-txt">{errors[f.name]}</span>}
          </div>
        ))}
        <div>
          <span style={{ fontWeight: "bold" }}>Note: </span> Decimal Results in division will be rounded to the nearest
          integer
        </div>
        <div className="btn">
          <CustomButton key="back" variant="ghost" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton disabled={isSubmitDisabled} key="submit" variant="primary" onClick={handleSubmit}>
            Submit
          </CustomButton>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateQuizModal;
