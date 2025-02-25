'use client'
interface ButtonProps {
    text: string;
    onClick: () => void;
  }
  
  export default function Button({ text, onClick }: ButtonProps) {
    return (
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
  