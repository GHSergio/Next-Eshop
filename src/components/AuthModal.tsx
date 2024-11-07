import React from "react";
import AuthForm from "./AuthForm";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-0 rounded-md max-w-md xs:w-50 md:w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 xs:text-xs md:text-2xl font-bold xs:px-1 xs:py-0 md:px-2 md:py-0"
        >
          ×
        </button>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthModal;
