import React from "react";
import "../css/Modal.css";

const Modal = ({ content, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>×</span>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Modal;
