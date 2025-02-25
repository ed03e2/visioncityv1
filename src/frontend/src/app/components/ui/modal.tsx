'use client'
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="backdrop-blur-md bg-gray-900/75 p-6 rounded-lg shadow-lg w-96">
        <button className="absolute top-2 right-2 text-gray-600 " onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
