import React from "react";

const Modal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Modal Content</h3>
            <p>This is a simple modal.</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      );
};

export default Modal;
