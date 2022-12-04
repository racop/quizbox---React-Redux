import React, { useState } from "react";
import CreateQuizModal from "../CreateQuizModal";
import CustomButton from "../CustomButton";
import "./header.css";

const AppHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <header className="header-wrapper">
      <span className="logo">QuizBox</span>
      <CustomButton variant="primary" onClick={showModal}>
        Create Quiz +
      </CustomButton>
      {isModalOpen && (
        <CreateQuizModal isModalOpen={isModalOpen} handleClose={handleClose} />
      )}
    </header>
  );
};

export default AppHeader;
