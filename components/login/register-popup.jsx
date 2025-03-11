"use client";
import React, { useEffect } from 'react';
import RegisterForm from './register-form';

const RegisterPopup = ({ onClose, onSuccess }) => {
  // Verhindert das Scrollen auf der Hauptseite, wenn das Popup offen ist
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="w-full max-w-md transform transition-all">
        <RegisterForm onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default RegisterPopup;
