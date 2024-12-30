import React from "react";
import "../../../css/employee/payment/notification.css";

function Notification({ message, onClose }) {
  return (
      <div className="popup-container">
        <div className="popup">
          <div className="circle">
            <span className="checkmark">✔</span>
          </div>
          <h2>{message}</h2>
          <button className="btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
  );
}

export default Notification;
