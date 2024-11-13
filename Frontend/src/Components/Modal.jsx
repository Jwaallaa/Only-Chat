import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ user, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains('modal')) {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{user.username}</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Modal;
