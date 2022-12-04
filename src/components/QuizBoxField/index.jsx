import { Input, InputNumber, Select } from "antd";
import React from "react";

const QuizBoxField = (props) => {
  const { name, placeholder, type, label, onChange, options, min, value, addonAfter, labelClass } = props;

  const getField = () => {
    switch (type) {
      case "multi-select":
        return (
          <Select
            name={name}
            className="antd-select"
            mode="multiple"
            allowClear
            onChange={onChange}
            options={options}
            placeholder={placeholder || "Enter something..."}
          />
        );
      case "number":
        return (
          <InputNumber
            name={name}
            min={min}
            className="antd-select"
            defaultValue={value}
            onChange={onChange}
            addonAfter={addonAfter}
            placeholder={placeholder || "Enter something..."}
          />
        );
      default:
        return (
          <Input
            type={type}
            className="antd-input"
            name={name}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Enter something..."}
          />
        );
    }
  };

  return (
    <>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {getField()}
    </>
  );
};

export default QuizBoxField;
