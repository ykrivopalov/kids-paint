import React from 'react';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{message}</h2>
        <div className="modal-buttons">
          <button className="modal-btn confirm" onClick={onConfirm}>Да! 👍</button>
          <button className="modal-btn cancel" onClick={onCancel}>Нет 🙅</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
