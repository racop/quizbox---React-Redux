import { Button } from "antd";
import React from "react";
import "./customButton.css";

const btnVariant = (variant) => {
  return variant === "primary" ? "btn-primary" : "btn-default";
};
const CustomButton = ({ variant, children, onClick, disabled }) => {
  const btnClass = btnVariant(variant);
  return (
    <Button
      disabled={disabled}
      className={btnClass}
      type={variant}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
